import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";

SwipeCardInput.propTypes = {
  deleteFormInput: PropTypes.func,
  initData: PropTypes.object,
  posMachine: PropTypes.array,
};

function SwipeCardInput(props) {
  const { initData, posMachine, deleteFormInput } = props;
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

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
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">
              Máy POS Id-Mid-Tid-Tên ngân hàng{" "}
              <FontAwesomeIcon
                icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                color="red"
              />
            </label>
            <select
              {...register("pos", { required: true })}
              className="form-select"
            >
              {posMachine?.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.id}-{pos.mid}-{pos.tid}-{pos.bank_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">
              Tên trên thẻ{" "}
              <FontAwesomeIcon
                icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                color="red"
              />
            </label>
            <input
              {...register("card_name")}
              type="text"
              className="form-control"
              required
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
              />
            </label>
            <input
              {...register("card_number")}
              type="text"
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="col-md-3">
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
        <div className="col-md-1">
          <div className="mb-3">
            <label className="form-label" style={{ color: "white" }}>
              White lbl
            </label>
            <button
              onClick={() => deleteFormInput()}
              className="btn btn-outline-danger"
            >
              Xoá
            </button>
          </div>
        </div>
        <div className="col-md-1">
          <div className="mb-3">
            <label className="form-label" style={{ color: "white" }}>
              White lbl
            </label>
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
        </div>
      </div>
    </form>
  );
}

export default SwipeCardInput;
