import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import productApi from "../../../api/productAPI";

function ProductDetail() {
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const response = await productApi.getDetail(id);
        console.log("Fetch product detail successfully", response);

        let initValues = { ...response };
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch product detail", error);
      }
    }

    fetchProductDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    try {
      const response = await productApi.updateOne(id, data);
      console.log("Update product successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update product", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await productApi.deleteOne(id);
      console.log("Delete product successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete product", error);
    }
  };
  return (
    <div>
      <h2 className="text-center">Cửa hàng </h2>
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

export default ProductDetail;
