import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useFieldArray, useForm } from "react-hook-form";
import { FaAsterisk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import { TOLLSTATUS, TRANSACTIONTYPE } from "../../ConstantUtils/constants";
import AddBillPOSMachineModal from "../../Modal/billPOSMachineModal";

SwipeCardInput.propTypes = {
  deleteFormInput: PropTypes.func,
  initData: PropTypes.object,
  requiredPosMachine: PropTypes.array.isRequired,
};

function SwipeCardInput(props) {
  const { initData, deleteFormInput, requiredPosMachine } = props;
  const { control, register, handleSubmit, formState, getValues, setValue } =
    useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "billpos", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });
  const { isSubmitting } = formState;

  const [dataListCardNumber, setDataListCardNumber] = useState([]);
  const [show, setShow] = useState(false);
  const [showNegativeMoney, setShowNegativeMoney] = useState(false);
  const [indexModal, setIndexModal] = useState(0);
  const [searchCreditCard, setSearchCreditCard] = useState("");
  const moneyInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("customer_money_needed", val);
  };

  useEffect(() => {
    function init() {
      append();
    }
    init();
  }, []); // eslint-disable-line

  const handleClose = (index) => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    delete data.creditcard?.credit_card_back_image;
    delete data.creditcard?.credit_card_front_image;

    for (const i in data.billpos) {
      data.billpos[i].bill_image = data.billpos[i].bill_image[0];
    }
    if (typeof data.transaction_with_customer_image === "string") {
      delete data.transaction_with_customer_image;
    } else {
      data.transaction_with_customer_image =
        data.transaction_with_customer_image[0];
    }
    try {
      console.log("data", data);
      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create swipe card transaction successfully", response);
      deleteFormInput();
    } catch (error) {
      console.log("Failed to create swipe card transaction", error);
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

  const handleNavigateSwipecardDetail = () => {
    let path = "/dashboard/swipecarddetail";
    let filledData = getValues();
    navigate(path, {
      state: {
        ...filledData,
        posMachineData: requiredPosMachine,
        showNegativeMoney: showNegativeMoney,
      },
    });
    localStorage.setItem("activeTab", path);
  };

  const handleOnChangeTransactionType = (e) => {
    let val = e.target.value;
    setShowNegativeMoney(parseInt(val) === 2);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Send Axios request here
      const result = await creditCardApi.search({
        card_number: searchCreditCard,
      });

      setDataListCardNumber([...result]);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCreditCard]);

  const handleOnChangeCardNumber = async (e) => {
    let event = e.nativeEvent.inputType ? "input" : "option selected";
    if (event === "input") {
      let val = e.target.value;
      if (val.length > 2) {
        setSearchCreditCard(val);
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
      setValue("creditcard.line_of_credit", card.line_of_credit);
      setValue("creditcard.card_ccv", card.card_ccv);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("store_name", { value: initData.store_name })}
        hidden
      />
      <input {...register("store_id", { value: initData.store_id })} hidden />
      <input
        {...register("store_phone_number", {
          value: initData.store_phone_number,
        })}
        hidden
      />
      <input
        {...register("store_address", { value: initData.store_address })}
        hidden
      />
      <div className="row">
        <div className="col-md-1">
          <div className="mb-3">
            <label className="form-label">Hoạt động</label>
            <select
              {...register("transaction_type")}
              className="form-select"
              required
              onChange={handleOnChangeTransactionType}
            >
              {TRANSACTIONTYPE?.map((ele) => (
                <option key={ele.value} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <FileInputField
          requiredColWidth={2}
          requiredLbl={"Hình GD với khách"}
          requiredRegister={register}
          requiredName={"transaction_with_customer_image"}
        />
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">
              Số thẻ <FaAsterisk color="red" size=".7em" />
            </label>
            <input
              {...register("creditcard.card_number")}
              type="text"
              className="form-control"
              required
              list="cardNumbers"
              id="myBrowser"
              placeholder="Nhập 3 số đầu để tìm"
              onChange={handleOnChangeCardNumber}
            />
            <datalist id="cardNumbers">
              {dataListCardNumber?.map((data, index) => (
                <option value={data.card_number} key={index}></option>
              ))}
            </datalist>
          </div>
        </div>
        <InputField
          requiredColWidth={2}
          requiredLbl="Tên khách hàng"
          requiredType="text"
          requiredRegister={register}
          requiredName="customer.name"
          // requiredIsRequired={true}
        />
        <InputField
          requiredColWidth={2}
          requiredLbl="Sđt khách hàng"
          requiredType="tel"
          requiredRegister={register}
          requiredName="customer.phone_number"
          requiredIsRequired={true}
        />
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">
              Số tiền cần
              <RequiredSymbol />{" "}
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
        {showNegativeMoney ? (
          <InputField
            requiredColWidth={2}
            requiredLbl="Âm tiền"
            requiredType="number"
            requiredRegister={register}
            requiredName="negative_money"
          />
        ) : null}
        {/* <InputField
          requiredColWidth={3}
          requiredLbl="Số thẻ"
          requiredType="text"
          requiredRegister={register}
          requiredName="creditcard.card_number"
          requiredIsRequired={true}
          optionalPlaceholder="Nhập 3 số đầu để tìm"
          optionalOnChange={handleOnChangeCardNumber}
        /> */}
      </div>
      <div className="row">
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
      {fields.map((item, index) => (
        <div className="row" key={item.id}>
          <SelectField
            requiredColWidth={2}
            requiredLbl={`Máy POS ${index}`}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={`billpos[${index}].pos`}
            requiredDataOption={requiredPosMachine}
            optionalLblSelect="Chọn máy POS"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) =>
              `${ele.id}-${ele.mid}-${ele.tid}-${ele.bank_name}`
            }
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
          {fields?.length > 1 && (
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
                  {isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Xoá
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="row">
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label" style={{ color: "white" }}>
              White
            </label>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => append({})}
              className="btn btn-outline-primary form-control"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Thêm bill pos
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
              onClick={() => deleteFormInput()}
              className="btn btn-outline-danger form-control"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Xoá
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
              type="submit"
              className="btn btn-outline-primary form-control"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Lưu
            </button>
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label" style={{ color: "white" }}>
              White
            </label>
            <button
              disabled={isSubmitting}
              onClick={() => handleNavigateSwipecardDetail()}
              className="btn btn-outline-primary form-control"
            >
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Chi tiết
            </button>
          </div>
        </div>
      </div>
      <AddBillPOSMachineModal
        requiredShow={show}
        requiredHandleClose={handleClose}
        requiredTitle={"Bill máy POS"}
        requiredRegister={register}
        index={indexModal}
        getValues={getValues}
      ></AddBillPOSMachineModal>
    </form>
  );
}

export default SwipeCardInput;
