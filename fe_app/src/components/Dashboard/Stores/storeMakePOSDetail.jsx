import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import storeMakePOSApi from "../../../api/storeMakePOSAPI";
import DisplayImageFileInputField from "../../Common/displayImageFileInputField";
import DownloadFileInputField from "../../Common/downloadFileInputField";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import {
  INPUTIMAGETYPEACCEPT,
  INPUTPDFFILETYPEACCEPT,
  WORKINGSTATUSOFSTOREMAKEPOS,
} from "../../ConstantUtils/constants";
import { formatDataFileField } from "../../Utilities/fileField";

function StoreMakePOSDetail() {
  const { register, handleSubmit, reset, getValues } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStoreDetail() {
      try {
        const response = await storeMakePOSApi.getDetail(id);
        console.log("Fetch store detail successfully", response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch stores detail", error);
      }
    }

    fetchStoreDetail();
  }, []); // eslint-disable-line

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

      const response = await storeMakePOSApi.updateOne(id, newData);
      console.log("Update store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update store", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await storeMakePOSApi.deleteOne(id);
      console.log("Delete store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete store", error);
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
          <DownloadFileInputField
            requiredColWidth={3}
            requiredLbl={"GPKD(PDF)"}
            requiredHref={`${getValues("business_license_file")}`}
            requiredLblHref={"Xem"}
            requiredRegister={register}
            requiredName={"business_license_file"}
            optionalAccept={INPUTPDFFILETYPEACCEPT}
          />
          <DownloadFileInputField
            requiredColWidth={3}
            requiredLbl={"Mã số thuế(PDF)"}
            requiredHref={`${getValues("tax_code_file")}`}
            requiredLblHref={"Xem"}
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
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt trước CCCD người đại diện"}
            requiredImageUrl={`${getValues(
              "representative_id_card_front_image"
            )}`}
            requiredRegister={register}
            requiredName={"representative_id_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Mặt sau CCCD người đại diện"}
            requiredImageUrl={`${getValues(
              "representative_id_card_back_image"
            )}`}
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
            type="button"
            onClick={() => onDelete()}
            className="btn btn-outline-danger mx-3"
          >
            Xoá
          </button>
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

export default StoreMakePOSDetail;
