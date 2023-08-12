import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import DisplayImageFileInputField from "../../Common/displayImageFileInputField";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import {
  GENDERCHOICES,
  INPUTIMAGETYPEACCEPT,
  TOLLSTATUS,
  TRANSACTIONTYPE,
} from "../../ConstantUtils/constants";
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

        setDataSwipCardDetail(response);
        reset({ ...response });
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

  const onDelete = async (id) => {
    try {
      const response = await swipeCardTransactionAPI.deleteOne(id);
      console.log("Delete swipe card successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete swipe card", error);
    }
  };

  const handleClose = (index, imageValue) => {
    setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };

  const onSubmit = async (data) => {
    try {
      if (data.creditcard.customer.id_card_front_image) {
        if (typeof data.creditcard.customer.id_card_front_image === "string") {
          delete data.creditcard.customer.id_card_front_image;
        } else {
          data.creditcard.customer.id_card_front_image =
            data.creditcard.customer.id_card_front_image[0];
        }
      }

      if (data.creditcard.customer.id_card_back_image) {
        if (typeof data.creditcard.customer.id_card_back_image === "string") {
          delete data.creditcard.customer.id_card_back_image;
        } else {
          data.creditcard.customer.id_card_back_image =
            data.creditcard.customer.id_card_back_image[0];
        }
      }

      if (data.creditcard.credit_card_back_image) {
        if (typeof data.creditcard.credit_card_back_image === "string") {
          delete data.creditcard.credit_card_back_image;
        } else {
          data.creditcard.credit_card_back_image =
            data.creditcard.credit_card_back_image[0];
        }
      }

      if (data.creditcard.credit_card_front_image) {
        if (typeof data.creditcard.credit_card_front_image === "string") {
          delete data.creditcard.credit_card_front_image;
        } else {
          data.creditcard.credit_card_front_image =
            data.creditcard.credit_card_front_image[0];
        }
      }

      if (data.transaction_with_customer_image) {
        if (typeof data.transaction_with_customer_image === "string") {
          delete data.transaction_with_customer_image;
        } else {
          data.transaction_with_customer_image =
            data.transaction_with_customer_image[0];
        }
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
          <InputField
            requiredColWidth={2}
            requiredLbl="Tên"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.name"}
          />
          <SelectField
            requiredColWidth={1}
            requiredLbl="Giới tính"
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"creditcard.customer.gender"}
            requiredDataOption={GENDERCHOICES}
            optionalLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"creditcard.customer.phone_number"}
            optionalDisabled={true}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số tiền cần"
            requiredType="number"
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"customer_money_needed"}
            optionalMaxForNumberType={999999999}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.bank_account.account_number"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.bank_account.bank_name"}
          />
        </div>
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt trước cmnd/cccd"}
            requiredImageUrl={`${getValues(
              "creditcard.customer.id_card_front_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.customer.id_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt sau cmnd/cccd"}
            requiredImageUrl={`${getValues(
              "creditcard.customer.id_card_back_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.customer.id_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Hình GD với khách"}
            requiredImageUrl={`${getValues("transaction_with_customer_image")}`}
            requiredRegister={register}
            requiredName={"transaction_with_customer_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
        </div>

        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Số thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_number"}
            optionalDisabled={true}
          />

          <InputField
            requiredColWidth={3}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_bank_name"}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_name"}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_issued_date"}
          />

          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_expire_date"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_ccv"}
            optionalMaxLengthForTextType={3}
          />
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Hoạt động"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"transaction_type"}
            requiredDataOption={TRANSACTIONTYPE}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
            optionalDisable={true}
          />
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Tình trạng thu phí"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"toll_status"}
            requiredDataOption={TOLLSTATUS}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
        </div>
        {/* <InputField
            requiredColWidth={2}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.maturity_date"}
          /> */}
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt trước thẻ tín dụng"}
            requiredImageUrl={`${getValues(
              "creditcard.credit_card_front_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.credit_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt sau thẻ tín dụng"}
            requiredImageUrl={`${getValues(
              "creditcard.credit_card_back_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.credit_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
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
        <div className="d-flex justify-content-end">
          <button
            type="button"
            onClick={() => onDelete(dataSwipCardDetail.id)}
            className="btn btn-outline-danger"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Xoá
          </button>
          <button
            disabled={isSubmitting}
            type="button"
            className="btn btn-outline-danger mx-3"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
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
