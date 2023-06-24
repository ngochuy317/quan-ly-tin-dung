import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import { posStatus } from "../../utils/constants";

function POSesDetail() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPOSDetail() {
      try {
        const response = await posApi.getDetail(id);
        console.log("Fetch pos detail successfully", response);

        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);

        let initValues = {};
        initValues.pos_id = response.pos_id;
        initValues.mid = response.mid;
        initValues.tid = response.tid;
        initValues.note = response.note;
        initValues.money_limit_per_day = response.money_limit_per_day;
        initValues.status = response.status;
        initValues.bank_name = response.bank_name;
        initValues.store = response.store;
        setStores(responseJSONStore);
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch pos detail", error);
      }
    }

    fetchPOSDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      const response = await posApi.updateOne(id, data);
      console.log("Update pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update pos", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await posApi.deleteOne(id);
      console.log("Delete pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete pos", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Máy POS</h2>
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
              <select {...register("status")} className="form-select">
                {posStatus.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
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
              <select {...register("store")} className="form-select" required>
                <option value="">Chọn cửa hàng</option>
                {stores?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
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
          <button type="button" className="btn btn-outline-danger mx-3">
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button type="submit" className="btn btn-outline-primary">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}

export default POSesDetail;
