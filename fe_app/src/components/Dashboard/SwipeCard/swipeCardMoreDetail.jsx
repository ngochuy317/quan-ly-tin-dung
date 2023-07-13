import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import { genderChoices, transactionType } from "../../ConstantUtils/constants";

function SwipeCardMoreDetail() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;

  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    function initData() {
      reset({ ...state });
    }

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (data) => {
    try {
      data.bill_pos_image = data.bill_pos_image[0];
      data.customer_id_card_front_image = data.customer_id_card_front_image[0];
      data.customer_id_card_back_image = data.customer_id_card_back_image[0];
      data.creditcard.credit_card_front_image =
        data.creditcard.credit_card_front_image[0];
      data.creditcard.credit_card_back_image =
        data.creditcard.credit_card_back_image[0];

      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create Swipecard successfully", response);
      navigate("../swipecard");
    } catch (error) {
      console.log("Failed to create swipecard", error);
    }
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
              <input
                type="text"
                className="form-control"
                value={state.posData}
                disabled
              />
              <input
                {...register("pos")}
                type="number"
                className="form-control"
                value={state.pos}
                hidden
              />
            </div>
          </div>
        </div>
        <h5>Khách hàng</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Tên{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">
                Giới tính{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <select
                {...register("customer_gender")}
                className="form-select"
                required
              >
                {genderChoices?.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="mb-3">
              <label className="form-label">
                Số điện thoại{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_phone_number")}
                type="tel"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Số tiền cần{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_money_needed")}
                type="number"
                className="form-control"
                max="999999999"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Số TK nhận tiền{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_account")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Ngân hàng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer_bank_account")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Hình bill máy pos{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("bill_pos_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Số thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_number")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Ngân hàng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_bank_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Hạn mức thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("line_of_credit")}
                type="number"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Phí{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("fee")}
                type="number"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Tên trên thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày mở thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_issued_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày hết hạn{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_expire_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                CCV{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Ngày sao kê{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.statement_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Ngày cuối đáo{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.maturity_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hoạt động</label>
              <select
                {...register("transaction_type")}
                className="form-select"
                required
              >
                {transactionType?.map((ele) => (
                  <option key={ele.value} value={ele.value}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <input
                {...register("is_payment_received")}
                type="checkbox"
                className="form-check-input"
                // checked
              />
              <label className="form-check-label">Tiền về</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt trước thẻ tín dụng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.credit_card_front_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt sau thẻ tín dụng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
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
          <button type="button" className="btn btn-outline-danger mx-3">
            <Link
              to="../swipecard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

export default SwipeCardMoreDetail;
