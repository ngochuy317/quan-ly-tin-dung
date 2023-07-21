import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import { genderChoices, transactionType } from "../../ConstantUtils/constants";
import BillPOSMachineModal from "../../Modal/billPOSMachineModal";
import InputField from "../../Common/inputField";

function SwipeCardMoreDetail() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
  } = useForm();
  const { isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "billpos", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const [posMachine, setPOSMachine] = useState([]);
  const [dataListCardNumber, setDataListCardNumber] = useState([]);

  const [isManualInput, setIsManualInput] = useState(false);
  const [show, setShow] = useState(false);
  const [isCreditCardBackImage, setIsCreditCardBackImage] = useState(false);
  const [isCreditCardFrontImage, setIsCreditCardFrontImage] = useState(false);
  const [indexModal, setIndexModal] = useState(0);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    function initData() {
      reset({ ...state });
      console.log(
        "🚀 ~ file: swipeCardMoreDetail.jsx:44 ~ initData ~ state:",
        state
      );
      append();
      if (state.creditcard.credit_card_back_image) {
        setIsCreditCardBackImage(true);
      }

      if (state.creditcard.credit_card_front_image) {
        setIsCreditCardFrontImage(true);
      }
      console.log(
        "🚀 ~ file: swipeCardMoreDetail.jsx:22 ~ initData ~ state:",
        state
      );
    }

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChangeCardNumber = async (e) => {
    let event = e.nativeEvent.inputType ? "input" : "option selected";
    if (event === "input") {
      let val = e.target.value;
      if (val.length > 2) {
        const result = await creditCardApi.search({ card_number: val });
        console.log(
          "🚀 ~ file: swipeCardInput.jsx:44 ~ handleOnChangeCardNumber ~ result:",
          result
        );
        setDataListCardNumber([...result]);
      }
    } else if (event === "option selected") {
      const card = dataListCardNumber.find(
        (c) => c.card_number === e.target.value
      );
      setValue("customer.phone_number", card.customer.phone_number);
      setValue("customer.name", card.customer.name);
      setValue("customer.gender", card.customer.gender);
      setValue("creditcard.card_bank_name", card.card_bank_name);
      setValue("creditcard.card_expire_date", card.card_expire_date);
      setValue("creditcard.card_issued_date", card.card_issued_date);
      setValue("creditcard.card_name", card.card_name);
      setValue(
        "creditcard.credit_card_back_image",
        card.credit_card_back_image
      );
      setValue(
        "creditcard.credit_card_front_image",
        card.credit_card_front_image
      );
      setValue("creditcard.maturity_date", card.maturity_date);
      setValue("creditcard.statement_date", card.statement_date);
    }
  };

  const handleClose = (index, imageValue) => {
    setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };

  const onSubmit = async (data) => {
    try {
      // data.bill_pos_image = data.bill_pos_image[0];
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
      if (typeof data.creditcard.credit_card_front_image === "string") {
        delete data.creditcard.credit_card_front_image;
      } else {
        data.creditcard.credit_card_front_image =
          data.creditcard.credit_card_front_image[0];
      }
      if (typeof data.creditcard.credit_card_back_image === "string") {
        delete data.creditcard.credit_card_back_image;
      } else {
        data.creditcard.credit_card_back_image =
          data.creditcard.credit_card_back_image[0];
      }
      // data.customer_id_card_front_image = data.customer_id_card_front_image[0];
      // data.customer_id_card_back_image = data.customer_id_card_back_image[0];
      // data.creditcard.credit_card_front_image =
      //   data.creditcard.credit_card_front_image[0];
      // data.creditcard.credit_card_back_image =
      //   data.creditcard.credit_card_back_image[0];

      console.log(
        "🚀 ~ file: swipeCardMoreDetail.jsx:140 ~ onSubmit ~ data:",
        data
      );
      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create Swipecard successfully", response);
      navigate("../swipecard");
    } catch (error) {
      console.log("Failed to create swipecard", error);
    }
  };

  const handleClickPosMachine = (index, e) => {
    setIndexModal(index);
    console.log(
      "🚀 ~ file: swipeCardInput.jsx:79 ~ handleClickPosMachine ~ index:",
      index
    );
    handleShow();
  };

  const handleOnChangeManualInput = (e) => {
    let check = e.target.checked;
    setIsManualInput(check);
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
          {/* <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Tên cửa hàng</label>
              <input
                {...register("store_name")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={4}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_address"}
            optionalDisabled={true}
          />
          {/* <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("store_address")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_phone_number"}
            optionalDisabled={true}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("store_phone_number")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div> */}
        </div>
        <h5>Máy POS</h5>
        <div className="row">
          {fields.map((item, index) => (
            <div key={item.id} className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Bill Máy Pos {index}</label>
                <button
                  id={`file-upload-${index}`}
                  disabled={isSubmitting}
                  className="btn btn-outline-primary form-control"
                  onClick={() => handleClickPosMachine(index)}
                  type="button"
                >
                  Thêm dữ liệu
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => append({})}
            className="btn btn-outline-primary "
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Thêm bill pos
          </button>
        </div>
        {/* <h5>Máy POS</h5>
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
        </div> */}
        <h5>Khách hàng</h5>
        <div className="row">
        <InputField
            requiredColWidth={2}
            requiredLbl="Tên"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.name"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Tên </label>
              <input
                {...register("customer.name")}
                type="text"
                className="form-control"
              />
            </div>
          </div> */}
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">Giới tính </label>
              <select {...register("customer.gender")} className="form-select">
                {genderChoices?.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"customer.phone_number"}
            requiredIsRequired={true}
          />
          {/* <div className="col-sm-2">
            <div className="mb-3">
              <label className="form-label">
                Số điện thoại{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("customer.phone_number")}
                type="tel"
                className="form-control"
                required
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số tiền cần"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer_money_needed"}
            requiredIsRequired={true}
          />
          {/* <div className="col-md-2">
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
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.bank_account.account_number"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số TK nhận tiền </label>
              <input
                {...register("customer.bank_account.account_number")}
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
            requiredName={"customer.bank_account.bank_name"}
          />
          {/* <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngân hàng </label>
              <input
                {...register("customer.bank_account.bank_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>*/}
        </div> 
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              <input
                {...register("customer_id_card_front_image")}
                type="file"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              <input
                {...register("customer_id_card_back_image")}
                type="file"
                className="form-control"
              />
            </div>
          </div>
          {/* <div className="col-md-4">
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
          </div> */}
        </div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckManualInput"
            onChange={handleOnChangeManualInput}
          />
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckManualInput"
          >
            Nhập bằng tay
          </label>
        </div>
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
                placeholder="Nhập 3 số đầu để tìm"
                list="cardNumbers"
                onChange={handleOnChangeCardNumber}
                required
              />
              <datalist id="cardNumbers">
                {dataListCardNumber?.map((data, index) => (
                  <option value={data.card_number} key={index}></option>
                ))}
              </datalist>
            </div>
          </div>
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_bank_name"}
            requiredIsRequired={true}
          />
          {/* <div className="col-md-4">
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
                disabled={!isManualInput}
                required
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Hạn mức thẻ"
            requiredType="number"
            requiredRegister={register}
            requiredName={"creditcard.line_of_credit"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-2">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-2">
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
                disabled={!isManualInput}
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
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-4">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
           <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_issued_date"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-3">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_expire_date"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-3">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_ccv"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
            optionalMaxLengthForTextType={3}
          />
          {/* <div className="col-md-2">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
        </div>
        <div className="row">
        <InputField
            requiredColWidth={3}
            requiredLbl="Ngày sao kê"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.statement_date"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-2">
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
                disabled={!isManualInput}
              />
            </div>
          </div> */}
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.maturity_date"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          {/* <div className="col-md-2">
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
                disabled={!isManualInput}
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
              <label className="form-label">
                Ảnh mặt trước thẻ tín dụng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              {isCreditCardFrontImage ? (
                <img
                  src={`${getValues("creditcard.credit_card_front_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.credit_card_front_image")}
                  type="file"
                  className="form-control"
                  required
                  disabled={!isManualInput}
                />
              )}
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
              {isCreditCardBackImage ? (
                <img
                  src={`${getValues("creditcard.credit_card_back_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.credit_card_back_image")}
                  type="file"
                  className="form-control"
                  required
                  disabled={!isManualInput}
                />
              )}
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
        <BillPOSMachineModal
          requiredShow={show}
          requiredHandleClose={handleClose}
          requiredTitle={"Bill máy POS"}
          requiredRegister={register}
          requiredPosMachine={state.posMachineData}
          index={indexModal}
          getValues={getValues}
        ></BillPOSMachineModal>
      </form>
    </div>
  );
}

export default SwipeCardMoreDetail;
