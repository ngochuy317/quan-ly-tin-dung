import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useFieldArray, useForm } from "react-hook-form";
import { FaAsterisk } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import customerApi from "../../../api/customerAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SearchSpiner from "../../Common/searchSpiner";
import SelectField from "../../Common/selectField";
import Spinner from "../../Common/spinner";
import {
  GENDERCHOICES,
  TOLLSTATUS,
  TRANSACTIONTYPE,
} from "../../ConstantUtils/constants";
import BillPOSMachineModal from "../../Modal/billPOSMachineModal";

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

  const [dataListCardNumber, setDataListCardNumber] = useState([]);
  const [dataListCustomer, setDataListCustomer] = useState([]);

  const [isManualInputCreditCardData, setIsManualInputCreditCardData] =
    useState(false);
  const [isManualInputCustomerData, setIsManualInputCuctomerdData] =
    useState(false);
  const [show, setShow] = useState(false);
  const [isSearchCreditCard, setIsSearchCreditCard] = useState(false);
  const [isSearchCustomer, setIsSearchCustomer] = useState(false);
  const [showNegativeMoney, setShowNegativeMoney] = useState(false);
  const [isCreditCardBackImage, setIsCreditCardBackImage] = useState(false);
  const [isCreditCardFrontImage, setIsCreditCardFrontImage] = useState(false);
  const [indexModal, setIndexModal] = useState(0);
  const [dataListCardSelect, setDataListCardSelect] = useState(null);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const { state } = useLocation();

  useEffect(() => {
    function initData() {
      reset({ ...state });
      setShowNegativeMoney(state.showNegativeMoney);
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

  const handleOnChangeTransactionType = (e) => {
    let val = e.target.value;
    setShowNegativeMoney(parseInt(val) === 2);
  };

  const handleOnChangeCustomerPhoneNumber = async (e) => {
    let event = e.nativeEvent.inputType ? "input" : "option selected";
    if (event === "input") {
      let val = e.target.value;
      if (val.length > 2) {
        setIsSearchCustomer(true);
        const result = await customerApi.search({ phone_number: val });
        console.log(
          "🚀 ~ file: swipeCardMoreDetail.jsx:120 ~ handleOnChangeCustomerPhoneNumber ~ result:",
          result
        );
        setDataListCustomer([...result]);
        setIsSearchCustomer(false);
      }
    } else if (event === "option selected") {
      const customer = dataListCustomer.find(
        (c) => c.phone_number === e.target.value
      );
      setValue("customer.phone_number", customer.phone_number);
      setValue("customer.name", customer.name);
      setValue("customer.gender", customer.gender);
    }
  };

  const handleOnChangeCardNumber = async (e) => {
    let event = e.nativeEvent.inputType ? "input" : "option selected";
    if (event === "input") {
      let val = e.target.value;
      if (val.length > 2) {
        setIsSearchCreditCard(true);
        const result = await creditCardApi.search({ card_number: val });
        console.log(
          "🚀 ~ file: swipeCardInput.jsx:44 ~ handleOnChangeCardNumber ~ result:",
          result
        );
        setDataListCardNumber([...result]);
        setIsSearchCreditCard(false);
      }
    } else if (event === "option selected") {
      const card = dataListCardNumber.find(
        (c) => c.card_number === e.target.value
      );
      setDataListCardSelect(card);
      setValue("creditcard.card_bank_name", card.card_bank_name);
      setValue("creditcard.card_expire_date", card.card_expire_date);
      setValue("creditcard.card_issued_date", card.card_issued_date);
      setValue("creditcard.card_name", card.card_name);
      setValue("creditcard.line_of_credit", card.line_of_credit);
      if (card?.credit_card_back_image) {
        setValue(
          "creditcard.credit_card_back_image",
          card.credit_card_back_image
        );
        setIsCreditCardBackImage(true);
      }
      if (card?.credit_card_front_image) {
        setValue(
          "creditcard.credit_card_front_image",
          card.credit_card_front_image
        );
        setIsCreditCardFrontImage(true);
      }
      setValue("creditcard.maturity_date", card.maturity_date);
      setValue("creditcard.statement_date", card.statement_date);
      setValue("creditcard.line_of_credit", card.line_of_credit);
      setValue("creditcard.card_ccv", card.card_ccv);
    }
  };

  const handleClose = (index, imageValue) => {
    setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };

  const moneyInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("customer_money_needed", val);
  };

  const onSubmit = async (data) => {
    try {
      if (
        typeof data.creditcard.id_card_front_image === "string" ||
        data.creditcard.id_card_front_image === undefined
      ) {
        delete data.creditcard.id_card_front_image;
      } else {
        data.creditcard.id_card_front_image =
          data.creditcard.id_card_front_image[0];
      }

      if (
        typeof data.creditcard.id_card_back_image === "string" ||
        data.creditcard.id_card_back_image === undefined
      ) {
        delete data.creditcard.id_card_back_image;
      } else {
        data.creditcard.id_card_back_image =
          data.creditcard.id_card_back_image[0];
      }

      if (
        typeof data.creditcard.credit_card_front_image === "string" ||
        data.creditcard.credit_card_front_image === undefined
      ) {
        delete data.creditcard.credit_card_front_image;
      } else {
        data.creditcard.credit_card_front_image =
          data.creditcard.credit_card_front_image[0];
      }

      if (
        typeof data.creditcard.credit_card_back_image === "string" ||
        data.creditcard.credit_card_back_image === undefined
      ) {
        delete data.creditcard.credit_card_back_image;
      } else {
        data.creditcard.credit_card_back_image =
          data.creditcard.credit_card_back_image[0];
      }

      if (
        typeof data.transaction_with_customer_image === "string" ||
        data.transaction_with_customer_image === undefined
      ) {
        delete data.transaction_with_customer_image;
      } else {
        data.transaction_with_customer_image =
          data.transaction_with_customer_image[0];
      }
      for (const i in data.billpos) {
        data.billpos[i].bill_image = data.billpos[i].bill_image[0];
      }
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

  const handleOnChangeManualInputCreditCardData = (e) => {
    let check = e.target.checked;
    setIsManualInputCreditCardData(check);
  };
  const handleOnChangeManualInputCustomerData = (e) => {
    let check = e.target.checked;
    setIsManualInputCuctomerdData(check);
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

        <h5>Khách hàng</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckManualInput"
            onChange={handleOnChangeManualInputCustomerData}
          />
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckManualInput"
          >
            Nhập bằng tay thông tin KH
          </label>
        </div>
        <div className="row">
          {/* <InputField
            requiredColWidth={3}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"customer.phone_number"}
            requiredIsRequired={true}
            optionalPlaceholder="Nhập SĐT để tìm KH"
          /> */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Số điện thoại <FaAsterisk color="red" size=".7em" />
              </label>
              {isSearchCustomer && <SearchSpiner />}
              <input
                {...register("customer.phone_number")}
                type="tel"
                className="form-control"
                placeholder="Nhập SĐT để tìm KH"
                list="phoneNumbers"
                onChange={handleOnChangeCustomerPhoneNumber}
                required
              />
              <datalist id="phoneNumbers">
                {dataListCustomer?.map((data, index) => (
                  <option value={data.phone_number} key={index}></option>
                ))}
              </datalist>
            </div>
          </div>
          <InputField
            requiredColWidth={2}
            requiredLbl="Tên khách hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"customer.name"}
            requiredIsRequired={true}
          />

          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Giới tính </label>
              <select
                {...register("customer.gender")}
                className="form-select"
                disabled={!isManualInputCustomerData}
              >
                {GENDERCHOICES?.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"account_number"}
            optionalDisabled={!isManualInputCustomerData}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"bank_name"}
            optionalDisabled={!isManualInputCustomerData}
          />
        </div>
        <div className="row"></div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckManualInput"
            onChange={handleOnChangeManualInputCreditCardData}
          />
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckManualInput"
          >
            Nhập bằng tay thông tin thẻ
          </label>
        </div>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng phát hành thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_bank_name"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInputCreditCardData}
          />
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Số thẻ <FaAsterisk color="red" size=".7em" />
              </label>
              {isSearchCreditCard && <SearchSpiner />}
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
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_name"}
            optionalDisabled={!isManualInputCreditCardData}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_issued_date"}
            optionalDisabled={!isManualInputCreditCardData}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_expire_date"}
            optionalDisabled={!isManualInputCreditCardData}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_ccv"}
            optionalDisabled={!isManualInputCreditCardData}
            optionalMaxLengthForTextType={3}
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước thẻ tín dụng </label>
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
                  disabled={!isManualInputCreditCardData}
                />
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau thẻ tín dụng</label>
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
                  disabled={!isManualInputCreditCardData}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              {dataListCardSelect?.creditcard?.id_card_front_image ? (
                <img
                  src={`${dataListCardSelect?.creditcard?.id_card_front_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.id_card_front_image")}
                  type="file"
                  className="form-control"
                  disabled={!isManualInputCreditCardData}
                />
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              {dataListCardSelect?.creditcard?.id_card_back_image ? (
                <img
                  src={`${dataListCardSelect?.creditcard?.id_card_back_image}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.id_card_back_image")}
                  type="file"
                  className="form-control"
                  disabled={!isManualInputCreditCardData}
                />
              )}
            </div>
          </div>
        </div>
        <h5>Chi tiết giao dịch</h5>
        <div className="row">
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Hoạt động"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"transaction_type"}
            requiredDataOption={TRANSACTIONTYPE}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
            optionalOnChangeSelect={handleOnChangeTransactionType}
          />
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Số tiền cần
                <RequiredSymbol />
              </label>
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("customer_money_needed")}
                required
                thousandSeparator={true}
                onChange={moneyInputFieldFormat}
              />
            </div>
          </div>
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
            optionalDisabled={!isManualInputCreditCardData}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={`Hình GD với khách`}
            requiredRegister={register}
            requiredName={"transaction_with_customer_image"}
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
          {showNegativeMoney ? (
            <InputField
              requiredColWidth={2}
              requiredLbl="Âm tiền"
              requiredType="number"
              requiredRegister={register}
              requiredName="negative_money"
            />
          ) : null}
        </div>
        <h5>Máy POS</h5>
        <div className="row">
          {fields.map((item, index) => (
            <div key={item.id} className="row">
              <SelectField
                requiredColWidth={2}
                requiredLbl={`Máy POS ${index}`}
                requiredIsRequired={true}
                requiredRegister={register}
                requiredName={`billpos[${index}].pos`}
                requiredDataOption={state.posMachineData}
                // OptionalOnChangeSelect={optionalHandleOnChangePOS}
                optionalLblSelect="Chọn máy POS"
                requiredValueOption={(ele) => `${ele.id}`}
                requiredLblOption={(ele) => `${ele.name}-${ele.mid}-${ele.tid}`}
              />
              <FileInputField
                requiredColWidth={4}
                requiredLbl={`Hình bill máy POS ${index}`}
                requiredIsRequired={true}
                requiredRegister={register}
                requiredName={`billpos[${index}].bill_image`}
              />
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
                    Thêm dữ liệu
                  </button>
                </div>
              </div>
              <div className="col-md-1">
                <div className="mb-3">
                  <label className="form-label" style={{ color: "white" }}>
                    White
                  </label>
                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      remove(index);
                    }}
                    className="btn btn-outline-danger form-control"
                  >
                    {isSubmitting && <Spinner />}
                    Xoá
                  </button>
                </div>
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
            {isSubmitting && <Spinner />}
            Thêm bill pos
          </button>
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
            {isSubmitting && <Spinner />}
            Lưu
          </button>
        </div>
        <BillPOSMachineModal
          requiredShow={show}
          requiredHandleClose={handleClose}
          requiredTitle={"Bill máy POS"}
          requiredRegister={register}
          index={indexModal}
          getValues={getValues}
          setValue={setValue}
        ></BillPOSMachineModal>
      </form>
    </div>
  );
}

export default SwipeCardMoreDetail;
