import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";

function NewStore() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await storeApi.createOne(data);
      console.log("Create store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create store", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Cửa hàng </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Mã địa điểm"
            requiredType="text"
            requiredRegister={register}
            requiredName="code"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên ghi nhớ"
            requiredType="text"
            requiredRegister={register}
            requiredName="name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName="phone_number"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <InputTextareaField
            requiredColWidth={6}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
          />
          <InputField
            requiredColWidth={6}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="address"
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary mx-3">
            Lưu
          </button>
          <button type="button" className="btn btn-outline-primary mx-3">
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewStore;
