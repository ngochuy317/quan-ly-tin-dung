import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import storeMakePOSApi from "../../../api/storeMakePOSAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import { INPUTIMAGETYPEACCEPT, INPUTPDFFILETYPEACCEPT, WORKINGSTATUSOFSTOREMAKEPOS } from "../../ConstantUtils/constants";
import { formatDataFileField } from "../../Utilities/fileField";

function NewStoreMakePOS() {
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    try {
      let newData;
      newData = formatDataFileField(data, [
        "tax_code_file",
        "business_license_file",
        "representative_id_card_front_image",
        "representative_id_card_back_image",
      ]);
      console.log("🚀 ~ file: storeDetail.jsx:35 ~ onSubmit ~ data:", newData);

      const response = await storeMakePOSApi.createOne(newData);
      console.log("Create store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create store", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Cửa hàng làm ra máy POS</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên cửa hàng hộ kinh doanh"
            requiredType="text"
            requiredRegister={register}
            requiredName="name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên người đại diện"
            requiredType="text"
            requiredRegister={register}
            requiredName="representative_s_name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="SĐT đăng ký"
            requiredType="tel"
            requiredRegister={register}
            requiredName="representative_s_phone_number"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={6}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="address"
            requiredIsRequired={true}
          />
          <FileInputField
            requiredColWidth={3}
            requiredLbl={"Giấy phép kinh doanh(PDF)"}
            requiredRegister={register}
            requiredName={"business_license_file"}
            optionalAccept={INPUTPDFFILETYPEACCEPT}
          />
          <FileInputField
            requiredColWidth={3}
            requiredLbl={"Mã số thuế(PDF)"}
            requiredRegister={register}
            requiredName={"tax_code_file"}
            optionalAccept={INPUTPDFFILETYPEACCEPT}
          />
          {/* <InputTextareaField
            requiredColWidth={6}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
          /> */}
        </div>
        <div className="row">
        <FileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt trước CCCD người đại diện"}
            requiredRegister={register}
            requiredName={"representative_id_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt sau CCCD người đại diện"}
            requiredRegister={register}
            requiredName={"representative_id_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <SelectField
            requiredColWidth={4}
            requiredLbl={"Trạng thái hoạt động"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"working_status"}
            requiredDataOption={WORKINGSTATUSOFSTOREMAKEPOS}
            optionalLblSelect="Chọn trạng thái"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary mx-3"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Lưu
          </button>
          <button
            disabled={isSubmitting}
            type="button"
            className="btn btn-outline-primary mx-3"
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
        </div>
      </form>
    </div>
  );
}

export default NewStoreMakePOS;
