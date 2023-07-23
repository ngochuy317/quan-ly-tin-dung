import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import userApi from "../../../api/userAPI";
import {
  ADMIN,
  EMPLOYEE,
  transactionType,
} from "../../ConstantUtils/constants";
import { AuthContext } from "../../Dashboard/dashboard";
import Pagination from "../../Pagination/pagination";
import SwipeCardInput from "./swipeCardInput";

function SwipeCard() {
  const { register, setValue, reset } = useForm();

  const [stores, setStores] = useState([]);
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [formInput, setFormInput] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [posMachine, setPOSMachine] = useState([]);
  const [initData, setInitData] = useState({});
  const [canAddForm, setCanAddForm] = useState(false);
  const posMachineRef = useRef();
  posMachineRef.current = posMachine;

  const formInputRef = useRef();
  formInputRef.current = formInput;

  const { role = "" } = React.useContext(AuthContext);

  useEffect(() => {
    async function initData() {
      try {
        if (role === EMPLOYEE) {
          const response = await userApi.getInformationDetail();
          console.log("Fetch information detail successfully", response);

          let initValues = {};
          initValues.store_name = response.store?.name;
          initValues.store_code = response.store?.code;
          initValues.store_id = response.store?.id;
          initValues.store_phone_number = response.store?.phone_number;
          initValues.store_address = response.store?.address;
          setPOSMachine(response.store?.poses);
          setInitData({ ...initValues });
          reset({ ...initValues });
        } else if (role === ADMIN) {
          const response = await storeApi.getAllFull();
          console.log("Fetch store data full successfully", response);
          setStores(response);
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    initData();
  }, [role]); // eslint-disable-line

  useEffect(() => {
    async function fetchTransactionHistory() {
      try {
        const responseHistorySwipeCard = await swipeCardTransactionAPI.getAll(
          params
        );
        console.log(
          "Fetch swipe card history list successfully",
          responseHistorySwipeCard
        );
        setResponseSwipeCardData(responseHistorySwipeCard);
      } catch (error) {
        console.log("Failed to fetch swipe card history", error);
      }
    }
    fetchTransactionHistory();
  }, [params]);

  const onAddForm = (event) => {
    setFormInput([
      ...formInput,
      <SwipeCardInput
        key={formInput.length}
        deleteFormInput={() => deleteFormInput(formInput.length)}
        initData={{ ...initData }}
        requiredPosMachine={posMachine}
      />,
    ]);
  };

  // const handleOnChangePOS = (e) => {
  //   if (e.target.value) {
  //     setCanAddForm(true);
  //   } else {
  //     setCanAddForm(false);
  //   }
  // };

  const deleteFormInput = (key) => {
    let newFormInput = formInputRef.current.filter(
      (ele) => ele.key !== key.toString()
    );
    setFormInput([...newFormInput]);
    setParams({ page: 1 });
  };

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const handleOnChangeStore = async (e) => {
    let val = parseInt(e.target.value);
    if (val) {
      let store = stores.find((c) => c.id === val);
      let initDataStore = {};
      initDataStore.store_name = store.name;
      initDataStore.store_code = store.code;
      initDataStore.store_id = store.id;
      initDataStore.store_phone_number = store.phone_number;
      initDataStore.store_address = store.address;
      setInitData({ ...initDataStore });
      setValue("store_address", store?.address);
      setValue("store_phone_number", store?.phone_number);
      setPOSMachine(store?.poses);
    } else {
      setValue("store_address");
      setValue("store_phone_number");
      setPOSMachine([]);
    }
    if (e.target.value) {
      setCanAddForm(true);
    } else {
      setCanAddForm(false);
    }
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <h5>Cửa hàng</h5>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng</label>
            {role === ADMIN ? (
              <select
                {...register("store_name")}
                className="form-select"
                onChange={handleOnChangeStore}
                disabled={stores.length > 0 ? null : true}
                required
              >
                <option value="">Chọn cửa hàng</option>
                {stores?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store?.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register("store_name")}
                type="text"
                className="form-control"
                disabled
              />
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Địa chỉ</label>
            <input
              {...register("store_address")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              {...register("store_phone_number")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
      </div>

      <h5>Quẹt thẻ</h5>

      {formInput?.map((formInp, index) => formInp)}

      <div className="row"></div>
      <div className="d-flex justify-content-end">
        <button
          onClick={onAddForm}
          disabled={!canAddForm}
          className="btn btn-outline-primary"
        >
          Thêm
        </button>
      </div>
      <h2 className="text-center">Lịch sử quẹt thẻ</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Tên trên thẻ</th>
              <th scope="col">Số thẻ</th>
              <th scope="col">Số tiền KH cần</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SDT khách hàng</th>
              <th scope="col">Hoạt động</th>
              <th scope="col">Ngày quẹt thẻ</th>
              <th scope="col">NV quẹt thẻ</th>
              <th scope="col">Ngày chỉnh sửa</th>
              {/* {role === ADMIN ? <th scope="col">Tiền về</th> : null} */}
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData?.results?.map((swipeCard, index) => (
              <tr key={swipeCard.id}>
                <th scope="row">{index + 1}</th>
                <td>{swipeCard.transaction_datetime_created}</td>
                <td>{swipeCard?.customer?.credit_card?.card_name}</td>
                <td>
                  <Link>{swipeCard?.customer?.credit_card?.card_number}</Link>
                </td>
                <td>{swipeCard.customer_money_needed}</td>
                <td>{swipeCard.customer?.name}</td>
                <td>{swipeCard.customer?.phone_number}</td>
                <td>
                  {
                    transactionType.find(
                      (c) => c.value === swipeCard.transaction_type
                    )?.label
                  }
                </td>
                <td>{swipeCard.transaction_datetime_created}</td>
                <td>{swipeCard.username}</td>
                <td>{swipeCard.transaction_datetime_updated}</td>
                {/* {role === ADMIN ? (
                  <td>{swipeCard.is_payment_received ? "Đã về" : "Chưa về"}</td>
                ) : null} */}
                <td>
                  <Link to={swipeCard.id + "/"}>Chỉnh sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
      canBedisabled={responseSwipeCardData?.results?.length ? false : true}
        currentPage={currentPage}
        totalPages={responseSwipeCardData.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default SwipeCard;
