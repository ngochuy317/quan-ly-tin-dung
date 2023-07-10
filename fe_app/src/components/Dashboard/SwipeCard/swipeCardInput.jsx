import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import { transactionType } from "../../ConstantUtils/constants";

SwipeCardInput.propTypes = {
  deleteFormInput: PropTypes.func,
  initData: PropTypes.object,
  posData: PropTypes.string,
  posId: PropTypes.number,
};

function SwipeCardInput(props) {
  const { initData, deleteFormInput, posData, posId } = props;
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const constTransactionType = transactionType;

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      data.bill_pos_image = data.bill_pos_image[0];

      const response = await swipeCardTransactionAPI.createOne(data);
      console.log("Create swipe card transaction successfully", response);
      deleteFormInput();
    } catch (error) {
      console.log("Failed to create swipe card transaction", error);
    }
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
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">POS Mid-Tid-Ngân hàng </label>
            <input
              type="text"
              className="form-control"
              value={posData}
              disabled
            />
            <input
              {...register("pos")}
              type="number"
              className="form-control"
              value={posId}
              hidden
            />
          </div>
        </div>
        <div className="col-md-1">
          <div className="mb-3">
            <label className="form-label">Hoạt động</label>
            <select
              {...register("transaction_type")}
              className="form-select"
              required
            >
              {constTransactionType?.map((ele) => (
                <option key={ele.value} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Số tiền KH cần </label>
            <input
              {...register("customer_money_needed")}
              type="number"
              className="form-control"
              defaultValue={0}
            />
          </div>
        </div> */}
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Tên trên thẻ </label>
            <input
              {...register("creditcard.card_name")}
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">
              Số thẻ{" "}
              <FontAwesomeIcon
                icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                color="red"
              />{" "}
            </label>
            <input
              {...register("creditcard.card_number")}
              type="text"
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="col-md-2">
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
        <div className="d-flex col-md-3">
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
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SwipeCardInput;
