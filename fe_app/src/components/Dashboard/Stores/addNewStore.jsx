import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import storeApi from "../../../api/storeAPI";

function NewStore() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await storeApi.createOne(data);
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
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Mã địa điểm</label>
              <input
                {...register("code")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên ghi nhớ</label>
              <input
                {...register("name")}
                type="text"
                className="form-control"
                required
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
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ghi chú</label>
              <input
                {...register("note")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("address")}
                type="text"
                className="form-control"
                required
              />
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

export default NewStore;
