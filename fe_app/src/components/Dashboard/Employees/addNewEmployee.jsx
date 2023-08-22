import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import employeeApi from "../../../api/employeeAPI";
import storeApi from "../../../api/storeAPI";
import FileInputField from "../../Common/fileInputField";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import Spinner from "../../Common/spinner";
import { GENDERCHOICES, ROLES } from "../../ConstantUtils/constants";

function NewEmployee() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListStore() {
      try {
        const response = await storeApi.getAllFull();
        console.log("Fetch store list successfully", response);
        setStores(response);
      } catch (error) {
        console.log("Failed to fetch pos detail", error);
      }
    }

    fetchListStore();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (!data.infomation_detail.transaction_discount) {
        data.infomation_detail.transaction_discount = 0;
      }
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
      const response = await employeeApi.createOne(data);
      console.log("Create employee successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create employee", error);
    }
  };
  return (
    <div>
      <h2 className="text-center">Thêm Nhân viên</h2>
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
          <InputField
            requiredColWidth={4}
            requiredLbl="Mật khẩu"
            requiredType="password"
            requiredRegister={register}
            requiredName="password"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
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
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh chân dung"}
            requiredRegister={register}
            requiredName={"infomation_detail.user_image"}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt trước CCCD"}
            requiredRegister={register}
            requiredName={"infomation_detail.identity_card_front_image"}
          />
          <FileInputField
            requiredColWidth={4}
            requiredLbl={"Ảnh mặt sau CCCD"}
            requiredRegister={register}
            requiredName={"infomation_detail.identity_card_back_image"}
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
            type="submit"
            className="btn btn-outline-primary mx-3"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner/>}
            Lưu
          </button>
          <button
            type="button"
            className="btn btn-outline-primary mx-3"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner/>}
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

export default NewEmployee;
