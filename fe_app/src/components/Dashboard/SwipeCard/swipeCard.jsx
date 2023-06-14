import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import userApi from "../../../api/userAPI";
import Pagination from "../../Pagination/pagination";

function SwipeCard() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [posMachine, setPOSMachine] = useState([]);

  useEffect(() => {
    async function fetchEmployeeDetail() {
      try {
        const response = await userApi.getInformationDetail();
        console.log("Fetch information detail successfully", response);

        let initValues = {};
        initValues.customer_money_needed = 0;
        initValues.fee = 0;
        initValues.line_of_credit = 0;
        initValues.store_name = response.store.name;
        initValues.store_code = response.store.code;
        initValues.store_id = response.store.id;
        initValues.store_phone_number = response.store.phone_number;
        initValues.store_address = response.store.address;
        setPOSMachine(response.store.poses);
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onSubmit = async (data) => {
    try {
      data.customer_id_card_front_image = data.customer_id_card_front_image[0];
      data.customer_id_card_back_image = data.customer_id_card_back_image[0];
      // data.creditcard.credit_card_front_image =
      //   data.creditcard.credit_card_front_image[0];
      // data.creditcard.credit_card_back_image =
      //   data.creditcard.credit_card_back_image[0];
      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create swipe card transaction successfully", response);

      reset();

      const responseHistorySwipeCard = await swipeCardTransactionAPI.getAll();
      console.log(
        "Fetch swipe card history list successfully",
        responseHistorySwipeCard
      );
      setResponseSwipeCardData(responseHistorySwipeCard);
    } catch (error) {
      console.log("Failed to create swipe card transaction", error);
    }
  };

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Tên cửa hàng</label>
              <input
                {...register("store_name")}
                type="text"
                className="form-control"
                disabled
              />
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
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Id-Mid-Tid-Tên ngân hàng</label>
              <select
                {...register("pos", { required: true })}
                className="form-select"
              >
                {posMachine &&
                  posMachine.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.id}-{pos.mid}-{pos.tid}-{pos.bank_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <h5>Khách hàng</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register("customer_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <input
                {...register("customer_gender")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("phone_number")}
                type="tel"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số tiền cần</label>
              <input
                {...register("customer_money_needed")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số TK nhận tiền</label>
              <input
                {...register("customer_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("customer_bank_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt trước cmnd/cccd{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_id_card_front_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt sau cmnd/cccd{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_id_card_back_image")}
                type="file"
                className="form-control"
                // required
              />
            </div>
          </div>
        </div>
        <div className="row"></div>
        <div className="d-flex justify-content-end">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Xác nhận
          </button>
        </div>
      </form>
      <h2 className="text-center">Lịch sử quẹt thẻ</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SDT khách hàng</th>
              <th scope="col">Số tiền KH cần</th>
              <th scope="col">Số thẻ</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData.results &&
              responseSwipeCardData.results.map((swipeCard, index) => (
                <tr key={swipeCard.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{swipeCard.transaction_datetime}</td>
                  <td>{swipeCard.customer_name}</td>
                  <td>{swipeCard.customer_phone_number}</td>
                  <td>{swipeCard.customer_money_needed}</td>
                  <td><Link>{swipeCard.creditcard ? swipeCard.creditcard.card_number : null}</Link></td>
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

export default SwipeCard;
