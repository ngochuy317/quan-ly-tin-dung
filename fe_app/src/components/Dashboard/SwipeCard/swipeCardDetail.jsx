import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import { genderChoices, transactionType } from "../../ConstantUtils/constants";

function SwipeCardDetail() {
  const { id } = useParams();
  const [dataSwipCardDetail, setDataSwipCardDetail] = useState();
  const { register, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSwipeCardTransactionDetail() {
      try {
        const response = await swipeCardTransactionAPI.getDetail(id);
        console.log("Fetch SwipeCardTransactionDetail successfully", response);

        let initValues = { ...response };
        setDataSwipCardDetail(response);
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch SwipeCardTransactionDetail", error);
      }
    }

    fetchSwipeCardTransactionDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      if (typeof data.bill_pos_image === "string") {
        delete data.bill_pos_image;
      } else {
        data.bill_pos_image = data.bill_pos_image[0];
      }

      if (typeof data.customer_id_card_front_image === "string") {
        delete data.customer_id_card_front_image;
      } else {
        data.customer_id_card_front_image =
          data.customer_id_card_front_image[0];
      }

      if (typeof data.customer_id_card_back_image === "string") {
        delete data.customer_id_card_back_image;
      } else {
        data.customer_id_card_back_image = data.customer_id_card_back_image[0];
      }

      delete data.creditcard.credit_card_front_image;
      delete data.creditcard.credit_card_back_image;
      delete data.pos;

      const response = await swipeCardTransactionAPI.updateOne(id, data);
      console.log("Update Swipecard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update swipecard", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Tên cửa hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_name"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_address"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_phone_number"}
            optionalDisabled={true}
          />
        </div>
        <h5>Máy POS</h5>
        <div className="row">
          {/* <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Id-Mid-Tid-Tên ngân hàng</label>
              <input
                value={
                  dataSwipCardDetail
                    ? `${dataSwipCardDetail.pos.id}-${dataSwipCardDetail.pos.mid}-${dataSwipCardDetail.pos.tid}-${dataSwipCardDetail.pos.bank_name}`
                    : ``
                }
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div> */}
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
          <SelectField
            requiredColWidth={1}
            requiredLbl="Giới tính"
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"customer_gender"}
            requiredDataOption={genderChoices}
            requiredLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
          {/* <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
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
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"customer_phone_number"}
          />
          {/* <div className="col-sm-2">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("customer_phone_number")}
                type="tel"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số tiền cần"
            requiredType="number"
            requiredRegister={register}
            requiredName={"customer_money_needed"}
            optionalMaxForNumberType={999999999}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số tiền cần</label>
              <input
                {...register("customer_money_needed")}
                type="number"
                className="form-control"
                max="999999999"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer_account"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số TK nhận tiền</label>
              <input
                {...register("customer_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer_bank_account"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("customer_bank_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              {dataSwipCardDetail?.customer_id_card_front_image ? (
                <img
                  src={`${dataSwipCardDetail?.customer_id_card_front_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer_id_card_front_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              {dataSwipCardDetail?.customer_id_card_back_image ? (
                <img
                  src={`${dataSwipCardDetail?.customer_id_card_back_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer_id_card_back_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh bill máy pos</label>
              {dataSwipCardDetail?.bill_pos_image ? (
                <img
                  src={`${dataSwipCardDetail?.bill_pos_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer_id_card_front_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>
        </div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Số thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_number"}
            optionalPlaceholder="Nhập 3 số đầu để tìm"
          />
          {/* <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số thẻ</label>
              <input
                {...register("creditcard.card_number")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_bank_name"}
          />
          {/* <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("creditcard.card_bank_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Hạn mức thẻ"
            requiredType="number"
            requiredRegister={register}
            requiredName={"line_of_credit"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hạn mức thẻ</label>
              <input
                {...register("line_of_credit")}
                type="number"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Phí</label>
              <input
                {...register("fee")}
                type="number"
                className="form-control"
              />
            </div>
          </div> */}
        </div>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_name"}
          />
          {/* <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên trên thẻ</label>
              <input
                {...register("creditcard.card_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_issued_date"}
          />
          {/* <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày mở thẻ</label>
              <input
                {...register("creditcard.card_issued_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_expire_date"}
          />
          {/* <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày hết hạn</label>
              <input
                {...register("creditcard.card_expire_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_ccv"}
            optionalMaxLengthForTextType={3}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">CCV</label>
              <input
                {...register("creditcard.card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
              />
            </div>
          </div> */}
        </div>
        <div className="row">
        <InputField
            requiredColWidth={2}
            requiredLbl="Ngày sao kê"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.statement_date"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày sao kê</label>
              <input
                {...register("creditcard.statement_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.maturity_date"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày cuối đáo</label>
              <input
                {...register("creditcard.maturity_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div> */}
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
              <label className="form-label">Ảnh mặt trước thẻ tín dụng</label>
              <img
                src={`${dataSwipCardDetail?.creditcard?.credit_card_front_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau thẻ tín dụng</label>
              <img
                src={`${dataSwipCardDetail?.creditcard?.credit_card_back_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-outline-danger mx-3">
            <Link
              to="./.."
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

export default SwipeCardDetail;
