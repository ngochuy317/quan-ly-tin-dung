import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import InputField from "../../Common/inputField";
import { transactionType } from "../../ConstantUtils/constants";
import BillPOSMachineModal from "../../Modal/billPOSMachineModal";

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

  const [show, setShow] = useState(false);
  const [indexModal, setIndexModal] = useState(0);

  useEffect(() => {
    function init() {
      append();
    }
    init();
  }, []);

  const handleClose = (index, imageValue) => {
    setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
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
    navigate(path, { state: { ...filledData } });
    localStorage.setItem("activeTab", path);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("store_name", { value: initData.store_name })}
        hidden
      />
      <input
        {...register("store_code", { value: initData.store_code })}
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
            >
              {transactionType?.map((ele) => (
                <option key={ele.value} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <InputField
          requiredColWidth={2}
          requiredLbl="Sđt khách hàng"
          requiredType="tel"
          requiredRegister={register}
          requiredName="customer.phone_number"
          requiredIsRequired={true}
        />
        <InputField
          requiredColWidth={2}
          requiredLbl="Số tiền cần"
          requiredType="text"
          requiredRegister={register}
          requiredName="customer_money_needed"
          requiredIsRequired={true}
        />
        <InputField
          requiredColWidth={2}
          requiredLbl="Số thẻ"
          requiredType="text"
          requiredRegister={register}
          requiredName="creditcard.card_number"
          requiredIsRequired={true}
        />
        {fields.map((item, index) => (
          <div key={item.id} className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Bill Máy Pos{index}</label>
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
      <div className="row">
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
      </div>
      <BillPOSMachineModal
        requiredShow={show}
        requiredHandleClose={handleClose}
        requiredTitle={"Bill máy POS"}
        requiredRegister={register}
        requiredPosMachine={requiredPosMachine}
        index={indexModal}
        getValues={getValues}
      ></BillPOSMachineModal>
    </form>
  );
}

export default SwipeCardInput;
