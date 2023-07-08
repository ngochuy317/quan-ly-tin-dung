import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import Pagination from "../../Pagination/pagination";
import SwipeCardInput from "./swipeCardInput";

function SwipeCardAdm() {
  const { register, formState, setValue, getValues } = useForm();
  
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [formInput, setFormInput] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [posMachine, setPOSMachine] = useState([]);
  const [stores, setStores] = useState([]);
  const [initData, setInitData] = useState({});
  const [canAddForm, setCanAddForm] = useState(false);

  const formInputRef = useRef();
  formInputRef.current = formInput;
  const posMachineRef = useRef();
  posMachineRef.current = posMachine;

  useEffect(() => {
    async function fetchEmployeeDetail() {
      try {
        const response = await storeApi.getAllFull();
        console.log("Fetch store data full successfully", response);

        setStores(response);
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []); // eslint-disable-line

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
        console.log("Failed to swipe card history", error);
      }
    }
    fetchTransactionHistory();
  }, [params]);

  const onAddForm = (event) => {
    let posData = getValues("pos_dropdown");
    let posId = posData.split("-")[0];

    setFormInput([
      ...formInput,
      <SwipeCardInput
        key={formInput.length}
        posData={posData}
        posId={posId}
        deleteFormInput={() => deleteFormInput(formInput.length)}
        initData={{ ...initData }}
      />,
    ]);
  };

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
  };

  const handleOnChangePOS = (e) => {
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
            <select
              {...register("store_name")}
              className="form-select"
              onChange={handleOnChangeStore}
              required
            >
              <option value="">Chọn cửa hàng</option>
              {stores?.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
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
      <h5>Máy POS</h5>
      <div className="col-md-2">
        <div className="mb-3">
          <label className="form-label">
            POS Mid-Tid-Ngân hàng{" "}
            <FontAwesomeIcon
              icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
              color="red"
            />
          </label>
          <select
            {...register("pos_dropdown")}
            className="form-select"
            required
            onChange={handleOnChangePOS}
            disabled={posMachine.length > 0 ? null : true}
          >
            <option value="">Chọn máy POS</option>
            {posMachine?.map((pos) => (
              <option
                key={pos.id}
                value={`${pos.id}-${pos.mid}-${pos.tid}-${pos.bank_name}`}
              >
                {pos.id}-{pos.mid}-{pos.tid}-{pos.bank_name}
              </option>
            ))}
          </select>
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
              <th scope="col">Tên trên thẻ thẻ</th>
              <th scope="col">Số thẻ</th>
              <th scope="col">Số tiền KH cần</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SDT khách hàng</th>
              <th scope="col">Hoạt động</th>
              <th scope="col">Ngày chỉnh sửa</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData?.results?.map((swipeCard, index) => (
              <tr key={swipeCard.id}>
                <th scope="row">{index + 1}</th>
                <td>{swipeCard.transaction_datetime_created}</td>
                <td>{swipeCard.creditcard?.card_name}</td>
                <td>
                  <Link>{swipeCard.creditcard?.card_number}</Link>
                </td>
                <td>{swipeCard.customer_money_needed}</td>
                <td>{swipeCard.customer_name}</td>
                <td>{swipeCard.customer_phone_number}</td>
                <td>{swipeCard.transaction_type}</td>
                <td>{swipeCard.transaction_datetime_updated}</td>
                <td>
                  <Link to={swipeCard.id + "/"}>Chỉnh sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={responseSwipeCardData.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default SwipeCardAdm;
