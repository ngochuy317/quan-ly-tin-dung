import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import storeApi from "../../../api/storeAPI";

function StoreDetail() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStoreDetail() {
      try {
        const response = await storeApi.getDetail(id);
        console.log("Fetch store detail successfully", response);

        let initValues = {};
        initValues.code = response.code;
        initValues.name = response.name;
        initValues.note = response.note;
        initValues.address = response.address;
        initValues.phone_number = response.phone_number;
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch stores detail", error);
      }
    }

    fetchStoreDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      const response = await storeApi.updateOne(id, data);
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
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Mã địa điểm</label>
              <input
                {...register("code")}
                type="text"
                className="form-control"
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
              />
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

export default StoreDetail;
