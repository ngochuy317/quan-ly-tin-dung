import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

function NewEmployee() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit } = useForm();
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
      console.log(data);
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
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input
                {...register("infomation_detail.fullname")}
                type="text"
                className="form-control"
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
              <input
                {...register("infomation_detail.gender")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày sinh</label>
              <input
                {...register("infomation_detail.dob")}
                type="date"
                className="form-control"
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
                className="form-control"
              >
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
              <select {...register("role")} className="form-control">
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

export default NewEmployee;
