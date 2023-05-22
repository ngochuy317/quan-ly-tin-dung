import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";

function NewPos() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListStore() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);
        setStores(responseJSONStore);
      } catch (error) {
        console.log("Failed to fetch pos detail", error);
      }
    }

    fetchListStore();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await posApi.createOne(data);
      console.log("Create pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create pos", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Thêm Máy POS</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Pos Id</label>
              <input
                {...register("pos_id", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Merchant ID(MID)</label>
              <input
                {...register("mid", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Terminal ID(TID)</label>
              <input
                {...register("tid", { required: true })}
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
                {...register("note", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới hạn quẹt tiền mỗi ngày</label>
              <input
                {...register("money_limit_per_day", { required: true })}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <input
                {...register("status", { required: true })}
                type="text"
                className="form-control"
              />
              {/* {errors.status && <p style={{ color: "red"}}>This is required.</p>} */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("bank_name", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              <select {...register("store")} className="form-control">
                {stores &&
                  stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
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
          <button type="button" className="btn btn-outline-danger mx-3">
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

export default NewPos;
