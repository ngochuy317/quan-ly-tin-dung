import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import productApi from "../../../api/productAPI";

function NewProduct() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await productApi.createOne(data);
      console.log("Create product successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create product", error);
    }
  };
  return (
    <div>
      <h2 className="text-center">Sản phẩm </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Giá</label>
              <input
                {...register("price")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số lượng</label>
              <input
                {...register("quantity")}
                type="number"
                className="form-control"
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

export default NewProduct;
