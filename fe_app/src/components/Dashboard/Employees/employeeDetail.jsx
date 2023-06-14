import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import employeeApi from "../../../api/employeeAPI";
import storeApi from "../../../api/storeAPI";

const Roles = [
  {
    roleKey: "admin",
    roleName: "Admin",
  },
  {
    roleKey: "employee",
    roleName: "Nhân viên",
  },
  {
    roleKey: "collaborators",
    roleName: "Cộng tác viên",
  },
];

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
        initValues.fullname = response.infomation_detail.fullname;
        initValues.address = response.infomation_detail.address;
        initValues.transaction_discount =
          response.infomation_detail.transaction_discount;
        initValues.gender = response.infomation_detail.gender;
        initValues.dob = response.infomation_detail.dob;
        initValues.date_joined = response.infomation_detail.date_joined;
        initValues.salary = response.infomation_detail.salary;
        initValues.phone_number = response.infomation_detail.phone_number;
        initValues.identity_card = response.infomation_detail.identity_card;
        initValues.place_of_issue_of_identity_card =
          response.infomation_detail.place_of_issue_of_identity_card;
        initValues.date_of_issue_of_identity_card =
          response.infomation_detail.date_of_issue_of_identity_card;
        initValues.username = response.username;
        initValues.store = response.infomation_detail.store_id;
        initValues.role = response.infomation_detail.role;
        setStores(responseStore);
        reset({ ...initValues });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchEmployeeDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                {...register("fullname")}
                type="text"
                className="form-control"
                readOnly
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
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                {...register("password")}
                type="password"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-7">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("address")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("phone_number")}
                type="tel"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">CMND/CCCD</label>
              <input
                {...register("identity_card")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày cấp CMND/CCCD</label>
              <input
                {...register("date_of_issue_of_identity_card")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Nơi cấp CMND/CCCD</label>
              <input
                {...register("place_of_issue_of_identity_card")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Phần trăm hoa hồng</label>
              <input
                {...register("transaction_discount")}
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
              <input
                {...register("gender")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày sinh</label>
              <input
                {...register("dob")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày bắt đầu làm việc</label>
              <input
                {...register("date_joined")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Lương</label>
              <input
                {...register("salary")}
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
              <select {...register("store")} className="form-select">
                {stores &&
                  stores.map((store) => (
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
              <select {...register("role")} className="form-select">
                {Roles &&
                  Roles.map((role) => (
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
