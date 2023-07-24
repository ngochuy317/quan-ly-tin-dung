import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import { formatDataFileField } from "../../Utilities/fileField";

function NewStore() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let newData;
      newData = formatDataFileField(data, [
        "business_license_image",
        "representative_id_card_front_image",
        "representative_id_card_back_image",
      ]);
      console.log("🚀 ~ file: storeDetail.jsx:35 ~ onSubmit ~ data:", newData);

      const response = await storeApi.createOne(newData);
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
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Mã số thuế"
            requiredType="text"
            requiredRegister={register}
            requiredName="tax_code"
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Tên người đại diện"
            requiredType="text"
            requiredRegister={register}
            requiredName="representative_s_name"
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="SĐT người đại diện"
            requiredType="text"
            requiredRegister={register}
            requiredName="representative_s_phone_number"
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Trạng thái hoạt động"
            requiredType="text"
            requiredRegister={register}
            requiredName="working_status"
          />
        </div>
        <div className="row">
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Hình GPKD"}
            requiredRegister={register}
            requiredName={"business_license_image"}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt trước CCCD người đại diện"}
            requiredRegister={register}
            requiredName={"representative_id_card_front_image"}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt sau CCCD người đại diện"}
            requiredRegister={register}
            requiredName={"representative_id_card_back_image"}
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
