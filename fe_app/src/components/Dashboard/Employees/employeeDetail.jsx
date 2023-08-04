import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import employeeApi from "../../../api/employeeAPI";
import storeApi from "../../../api/storeAPI";
import DisplayImageFileInputField from "../../Common/displayImageFileInputField";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import {
  GENDERCHOICES,
  INPUTIMAGETYPEACCEPT,
  ROLES,
} from "../../ConstantUtils/constants";

function EmployeeDetail() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { isSubmitting } = formState;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await employeeApi.getDetail(id);
        console.log("Fetch employee detail successfully", response);

        const responseStore = await storeApi.getAllFull();
        console.log("Fetch stores list successfully", responseStore);
        setStores(responseStore);
        reset({ ...response });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchEmployeeDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      if (typeof data.infomation_detail.user_image === "string") {
        data.infomation_detail.user_image = null;
      } else if (data.infomation_detail.user_image) {
        data.infomation_detail.user_image =
          data.infomation_detail.user_image[0];
      }
      if (
        typeof data.infomation_detail.identity_card_front_image === "string"
      ) {
        data.infomation_detail.identity_card_front_image = null;
      } else if (data.infomation_detail.identity_card_front_image) {
        data.infomation_detail.identity_card_front_image =
          data.infomation_detail.identity_card_front_image[0];
      }
      if (typeof data.infomation_detail.identity_card_back_image === "string") {
        data.infomation_detail.identity_card_back_image = null;
      } else if (data.infomation_detail.identity_card_back_image) {
        data.infomation_detail.identity_card_back_image =
          data.infomation_detail.identity_card_back_image[0];
      }
      console.log("🚀 ~ file: employeeDetail.jsx:37 ~ onSubmit ~ data:", data);
      const response = await employeeApi.updateOne(id, data);
      console.log("Update employee successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update employee", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await employeeApi.deleteOne(id);
      console.log("Delete employee successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete employee", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Nhân viên</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Họ và tên"
            requiredType="text"
            requiredRegister={register}
            requiredName="infomation_detail.fullname"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên đăng nhập"
            requiredType="text"
            requiredRegister={register}
            requiredName="username"
            requiredIsRequired={true}
          />
          <div className="col-md-4">
            <div className="mb-3">
              {/* <label className="form-label">Mật khẩu</label>
              <input
                {...register("password")}
                type="password"
                className="form-control"
              /> */}
            </div>
          </div>
          <InputField
            requiredColWidth={7}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="infomation_detail.address"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName="infomation_detail.phone_number"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Email"
            requiredType="email"
            requiredRegister={register}
            requiredName="infomation_detail.email"
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="CMND/CCCD"
            requiredType="text"
            requiredRegister={register}
            requiredName="infomation_detail.identity_card"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày cấp CMND/CCCD"
            requiredType="date"
            requiredRegister={register}
            requiredName="infomation_detail.date_of_issue_of_identity_card"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Nơi cấp CMND/CCCD"
            requiredType="text"
            requiredRegister={register}
            requiredName="infomation_detail.place_of_issue_of_identity_card"
            requiredIsRequired={true}
          />
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Phần trăm hoa hồng</label>
              <input
                {...register("infomation_detail.transaction_discount")}
                type="number"
                step="0.01"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <SelectField
            requiredColWidth={3}
            requiredLbl={"Giới tính"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"infomation_detail.gender"}
            requiredDataOption={GENDERCHOICES}
            optionalLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày sinh"
            requiredType="date"
            requiredRegister={register}
            requiredName="infomation_detail.dob"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày bắt đầu làm việc"
            requiredType="date"
            requiredRegister={register}
            requiredName="infomation_detail.date_joined"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Lương"
            requiredType="number"
            requiredRegister={register}
            requiredName="infomation_detail.salary"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh chân dung"}
            requiredImageUrl={`${getValues("infomation_detail.user_image")}`}
            requiredRegister={register}
            requiredName={"infomation_detail.user_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt trước CCCD"}
            requiredImageUrl={`${getValues(
              "infomation_detail.identity_card_front_image"
            )}`}
            requiredRegister={register}
            requiredName={"infomation_detail.identity_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt sau CCCD"}
            requiredImageUrl={`${getValues(
              "infomation_detail.identity_card_back_image"
            )}`}
            requiredRegister={register}
            requiredName={"infomation_detail.identity_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
        </div>
        <div className="row">
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"infomation_detail.store"}
            requiredDataOption={stores}
            optionalLblSelect="Chọn cửa hàng"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
          />
          <SelectField
            requiredColWidth={4}
            requiredLbl={"Cấo bậc"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"role"}
            requiredDataOption={ROLES}
            optionalLblSelect="Chọn cấp bậc"
            requiredValueOption={(ele) => `${ele.roleKey}`}
            requiredLblOption={(ele) => `${ele.roleName}`}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            onClick={() => onDelete()}
            className="btn btn-outline-danger mx-3"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Xoá
          </button>
          <button
            type="submit"
            className="btn btn-outline-primary mx-3"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Lưu
          </button>
          <button
            type="button"
            className="btn btn-outline-primary mx-3"
            disabled={isSubmitting}
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

export default EmployeeDetail;
