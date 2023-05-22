import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import userApi from "../../../api/userAPI";

function SwipeCard() {
  const { register, handleSubmit, reset } = useForm();
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployeeDetail() {
      try {
        const response = await userApi.getInformationDetail();
        console.log("Fetch information detail successfully", response);

        const responseHistorySwipeCard = await swipeCardTransactionAPI.getAll();
        console.log(
          "Fetch swipe card history list successfully",
          responseHistorySwipeCard
        );
        setResponseSwipeCardData(responseHistorySwipeCard);

        let initValues = {};
        initValues.name = response.store.name;
        initValues.phone_number = response.store.phone_number;
        initValues.address = response.store.address;
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to information detail detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []);

  const onSubmit = async (data) => {
    try {
      data.customer_id_card_front_image = data.customer_id_card_front_image[0];
      data.customer_id_card_back_image = data.customer_id_card_back_image[0];
      data.creditcard.credit_card_front_image =
        data.creditcard.credit_card_front_image[0];
      data.creditcard.credit_card_back_image =
        data.creditcard.credit_card_back_image[0];
      console.log("data", data);
      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create swipe card transaction successfully", response);
      reset({ ...{} });
    } catch (error) {
      console.log("Failed to create swipe card transaction", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Tên cửa hàng</label>
              <input
                {...register("name")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("address")}
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
                {...register("phone_number")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>
        <h5>Khách hàng</h5>
        <div className="row">
          {/* <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">Mã KH</label>
              <input
                name="customer_code"
                type="text"
                className="form-control"
                required
              />
            </div>
          </div> */}
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
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
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
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
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
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số thẻ</label>
              <input
                {...register("card_number")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
              {...register("card_bank_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hạn mức thẻ</label>
              <input
              {...register("line_of_credit")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Phí</label>
              <input
              {...register("fee")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
              {...register("card_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày mở thẻ</label>
              <input
              {...register("card_issued_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày hết hạn</label>
              <input
              {...register("card_expire_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">CCV</label>
              <input
              {...register("card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày sao kê</label>
              <input
              {...register("statement_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày cuối đáo</label>
              <input
              {...register("maturity_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước thẻ tín dụng</label>
              <input
                {...register("creditcard.credit_card_front_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau thẻ tín dụng</label>
              <input
                {...register("creditcard.credit_card_back_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary">
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
              <th scope="col">Tên ghi nhớ</th>
              <th scope="col">Ghi chú</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Số điện thoại</th>
              {/* <th scope="col">Thao tác</th> */}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData &&
              responseSwipeCardData.map((swipeCard, index) => (
                <tr key={swipeCard.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{swipeCard.transaction_datetime}</td>
                  <td>{swipeCard.customer_id_card_front_image}</td>
                  <td>{swipeCard.customer_id_card_back_image}</td>
                  <td>{swipeCard.is_payment_received}</td>
                  <td>{swipeCard.is_payment_received}</td>
                  {/* <td>
                    <Link to={store.id + "/"}>Chỉnh sửa</Link>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* <Pagination
        currentPage={currentPage}
        totalPages={responseData.total_pages}
        handleChangePage={handleChangePage}
      /> */}
    </div>
  );
}

export default SwipeCard;
