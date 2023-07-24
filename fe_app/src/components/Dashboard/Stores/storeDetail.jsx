import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import { formatDataFileField } from "../../Utilities/fileField";

function StoreDetail() {
  const { register, handleSubmit, reset, getValues } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStoreDetail() {
      try {
        const response = await storeApi.getDetail(id);
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
        "business_license_image",
        "representative_id_card_front_image",
        "representative_id_card_back_image",
      ]);
      console.log("🚀 ~ file: storeDetail.jsx:35 ~ onSubmit ~ data:", newData);

      const response = await storeApi.updateOne(id, newData);
      console.log("Update store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update store", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await storeApi.deleteOne(id);
      console.log("Delete store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete store", error);
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
            requiredType="tel"
            requiredRegister={register}
            requiredName="note"
          />
          <InputField
            requiredColWidth={6}
            requiredLbl="Địa chỉ"
            requiredType="tel"
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
          {getValues("business_license_image") ? (
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Ảnh mặt trước thẻ tín dụng</label>
                <img
                  src={`${getValues("business_license_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              </div>
            </div>
          ) : (
            <FileInputField
              requiredColWidth={4}
              requiredLbl={"Hình GPKD"}
              requiredRegister={register}
              requiredName={"business_license_image"}
            />
          )}
          {getValues("representative_id_card_front_image") ? (
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">
                  Mặt trước CCCD người đại diện
                </label>
                <img
                  src={`${getValues("representative_id_card_front_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              </div>
            </div>
          ) : (
            <FileInputField
              requiredColWidth={4}
              requiredLbl={"Mặt trước CCCD người đại diện"}
              requiredRegister={register}
              requiredName={"representative_id_card_front_image"}
            />
          )}
          {getValues("representative_id_card_back_image") ? (
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">
                  Mặt sau CCCD người đại diện
                </label>
                <img
                  src={`${getValues("representative_id_card_back_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              </div>
            </div>
          ) : (
            <FileInputField
              requiredColWidth={4}
              requiredLbl={"Mặt sau CCCD người đại diện"}
              requiredRegister={register}
              requiredName={"representative_id_card_back_image"}
            />
          )}
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

export default StoreDetail;
