import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import { GENDERCHOICES, TRANSACTIONTYPE } from "../../ConstantUtils/constants";
import ModifiyBillPOSMachineModal from "../../Modal/modifyBillPosMachineModal";

function SwipeCardDetail() {
  const { id } = useParams();
  const [dataSwipCardDetail, setDataSwipCardDetail] = useState();
  const [indexModal, setIndexModal] = useState(0);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const { register, handleSubmit, reset, formState, getValues, setValue } =
    useForm();
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

  const handleClickPosMachine = (index, e) => {
    setIndexModal(index);
    console.log(
      "🚀 ~ file: swipeCardInput.jsx:79 ~ handleClickPosMachine ~ index:",
      index
    );
    console.log(
      "🚀 ~ file: swipeCardDetail.jsx:47 ~ handleClickPosMachine ~ getValues:",
      getValues(`billpos[${index}]`)
    );
    handleShow();
  };

  const handleClose = (index, imageValue) => {
    setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };

  const onSubmit = async (data) => {
    try {
      if (typeof data.customer.id_card_front_image === "string") {
        delete data.customer.id_card_front_image;
      } else {
        data.customer.id_card_front_image =
          data.customer.id_card_front_image[0];
      }

      if (typeof data.customer.id_card_back_image === "string") {
        delete data.customer.id_card_back_image;
      } else {
        data.customer.id_card_back_image = data.customer.id_card_back_image[0];
      }

      if (
        typeof data.customer.credit_card.credit_card_back_image === "string"
      ) {
        delete data.customer.credit_card.credit_card_back_image;
      } else {
        data.customer.credit_card.credit_card_back_image =
          data.customer.credit_card.credit_card_back_image[0];
      }

      if (
        typeof data.customer.credit_card.credit_card_front_image === "string"
      ) {
        delete data.customer.credit_card.credit_card_front_image;
      } else {
        data.customer.credit_card.credit_card_front_image =
          data.customer.credit_card.credit_card_front_image[0];
      }

      console.log("🚀 ~ file: swipeCardDetail.jsx:34 ~ onSubmit ~ data:", data);
      // delete data.customer.credit_card.credit_card_front_image;
      // delete data.credit_card.credit_card_back_image;
      // delete data.pos;

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
        <div className="row"></div>
        <h5>Khách hàng</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register("customer.name")}
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
            requiredName={"customer.gender"}
            requiredDataOption={GENDERCHOICES}
            requiredLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"customer.phone_number"}
            optionalDisabled={true}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số tiền cần"
            requiredType="number"
            requiredRegister={register}
            requiredName={"customer_money_needed"}
            optionalMaxForNumberType={999999999}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.bank_account.account_number"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.bank_account.bank_name"}
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              {dataSwipCardDetail?.customer?.id_card_front_image ? (
                <img
                  src={`${dataSwipCardDetail?.customer?.id_card_front_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer.id_card_front_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              {dataSwipCardDetail?.customer?.id_card_back_image ? (
                <img
                  src={`${dataSwipCardDetail?.customer?.id_card_back_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer.id_card_back_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>

          <h5>Máy POS</h5>
          {dataSwipCardDetail?.billpos?.map((item, index) => (
            <div key={item.id} className="row">
              <InputField
                requiredColWidth={2}
                requiredLbl="Máy POS"
                requiredType="text"
                requiredRegister={register}
                requiredName={`billpos[${index}].pos`}
                optionalDisabled={true}
              />
              {getValues(`billpos[${index}].bill_image`) && (
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Hình bill máy POS</label>
                    <img
                      src={getValues(`billpos[${index}].bill_image`)}
                      style={{ maxWidth: "100%", height: "auto" }}
                      alt=""
                    ></img>
                  </div>
                </div>
              )}
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Bill Máy Pos {index}</label>
                  <button
                    id={`file-upload-${index}`}
                    disabled={isSubmitting}
                    className="btn btn-outline-primary form-control"
                    onClick={() => handleClickPosMachine(index)}
                    type="button"
                  >
                    Xem dữ liệu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Số thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_number"}
            optionalDisabled={true}
          />

          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_bank_name"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Hạn mức thẻ"
            requiredType="number"
            requiredRegister={register}
            requiredName={"customer.credit_card.line_of_credit"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_name"}
          />

          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_issued_date"}
          />

          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_expire_date"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.credit_card.card_ccv"}
            optionalMaxLengthForTextType={3}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngày sao kê"
            requiredType="date"
            requiredRegister={register}
            requiredName={"customer.credit_card.statement_date"}
          />
          {/* <InputField
            requiredColWidth={2}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.maturity_date"}
          /> */}
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hoạt động</label>
              <select
                {...register("transaction_type")}
                className="form-select"
                required
              >
                {TRANSACTIONTYPE?.map((ele) => (
                  <option key={ele.value} value={ele.value}>
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className="col-md-2">
            <div className="mb-3">
              <input
                {...register("is_payment_received")}
                type="checkbox"
                className="form-check-input"
                // checked
              />
              <label className="form-check-label">Tiền về</label>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước thẻ tín dụng</label>

              {dataSwipCardDetail?.customer?.credit_card
                ?.credit_card_front_image ? (
                <img
                  src={`${dataSwipCardDetail.customer.credit_card.credit_card_front_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer.credit_card.credit_card_front_image")}
                  type="file"
                  className="form-control"
                />
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau thẻ tín dụng</label>
              {dataSwipCardDetail?.customer?.credit_card
                ?.credit_card_back_image ? (
                <img
                  src={`${dataSwipCardDetail.customer.credit_card.credit_card_back_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("customer.credit_card.credit_card_back_image")}
                  type="file"
                  className="form-control"
                />
              )}
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
        <ModifiyBillPOSMachineModal
          requiredShow={show}
          requiredHandleClose={handleClose}
          requiredTitle={"Bill máy POS"}
          requiredRegister={register}
          index={indexModal}
          getValues={getValues}
        ></ModifiyBillPOSMachineModal>
      </form>
    </div>
  );
}

export default SwipeCardDetail;
