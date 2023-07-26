import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import FileInputField from "../../Common/fileInputField";
import { INPUTPDFFILETYPEACCEPT } from "../../ConstantUtils/constants";
import { formatDataFileField } from "../../Utilities/fileField";

function NewStore() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let newData;
      newData = formatDataFileField(data, ["contract_of_house_renting_file"]);
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
            requiredColWidth={3}
            requiredLbl="Tên ghi nhớ"
            requiredType="text"
            requiredRegister={register}
            requiredName="name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={6}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="address"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName="phone_number"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <FileInputField
            requiredColWidth={3}
            requiredLbl={"Hợp đồng thuê nhà(PDF)"}
            requiredRegister={register}
            requiredName={"contract_of_house_renting_file"}
            optionalAccept={INPUTPDFFILETYPEACCEPT}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Tiền thuê nhà"
            requiredType="number"
            requiredRegister={register}
            requiredName="rent"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Tiền điện"
            requiredType="number"
            requiredRegister={register}
            requiredName="electric_bill"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Tiền nước"
            requiredType="number"
            requiredRegister={register}
            requiredName="water_bill"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Phụ phí"
            requiredType="number"
            requiredRegister={register}
            requiredName="surcharge"
          />
          <InputTextareaField
            requiredColWidth={6}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
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
