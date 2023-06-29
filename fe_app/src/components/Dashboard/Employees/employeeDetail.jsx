import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import employeeApi from "../../../api/employeeAPI";
import storeApi from "../../../api/storeAPI";
import { Roles } from "../../utils/constants";
import { genderChoices } from "../../utils/constants";

function EmployeeDetail() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await employeeApi.getDetail(id);
        console.log("Fetch employee detail successfully", response);

        const responseStore = await storeApi.getAllFull();
        console.log("Fetch stores list successfully", responseStore);

        let initValues = {};
        initValues.infomation_detail = {};
        initValues.infomation_detail.fullname =
          response.infomation_detail.fullname;
        initValues.infomation_detail.address =
          response.infomation_detail.address;
        initValues.infomation_detail.transaction_discount =
          response.infomation_detail.transaction_discount;
        initValues.infomation_detail.gender = response.infomation_detail.gender;
        initValues.infomation_detail.dob = response.infomation_detail.dob;
        initValues.infomation_detail.date_joined =
          response.infomation_detail.date_joined;
        initValues.infomation_detail.salary = response.infomation_detail.salary;
        initValues.infomation_detail.phone_number =
          response.infomation_detail.phone_number;
        initValues.infomation_detail.identity_card =
          response.infomation_detail.identity_card;
        initValues.infomation_detail.place_of_issue_of_identity_card =
          response.infomation_detail.place_of_issue_of_identity_card;
        initValues.infomation_detail.date_of_issue_of_identity_card =
          response.infomation_detail.date_of_issue_of_identity_card;
        initValues.username = response.username;
        initValues.infomation_detail.store =
          response.infomation_detail.store_id;
        initValues.role = response.role;
        setStores(responseStore);
        reset({ ...initValues });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchEmployeeDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
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
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input
                {...register("infomation_detail.fullname")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên đăng nhập</label>
              <input
                {...register("username")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
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
          <div className="col-md-7">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("infomation_detail.address")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("infomation_detail.phone_number")}
                type="tel"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">CMND/CCCD</label>
              <input
                {...register("infomation_detail.identity_card")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày cấp CMND/CCCD</label>
              <input
                {...register(
                  "infomation_detail.date_of_issue_of_identity_card"
                )}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Nơi cấp CMND/CCCD</label>
              <input
                {...register(
                  "infomation_detail.place_of_issue_of_identity_card"
                )}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
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
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <select
                {...register("infomation_detail.gender")}
                className="form-select"
              >
                {genderChoices?.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày sinh</label>
              <input
                {...register("infomation_detail.dob")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày bắt đầu làm việc</label>
              <input
                {...register("infomation_detail.date_joined")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Lương</label>
              <input
                {...register("infomation_detail.salary")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              <select
                {...register("infomation_detail.store")}
                className="form-select"
                required
              >
                <option value="">Chọn cửa hàng</option>
                {stores?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Cấp bậc</label>
              <select {...register("role")} className="form-select" required>
                <option value="">Chọn cấp bậc</option>
                {Roles?.map((role) => (
                  <option key={role.roleKey} value={role.roleKey}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>
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

export default EmployeeDetail;
