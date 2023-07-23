import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import { posStatus } from "../../ConstantUtils/constants";

function NewPos() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
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

  const handleOnChangeMoneyLimitPerDay = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("money_limit_per_day", val);
  };

  const onSubmit = async (data) => {
    try {
      console.log("🚀 ~ file: addNewPos.jsx:29 ~ onSubmit ~ data:", data);
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
              <label className="form-label">Merchant ID(MID)</label>
              <input
                {...register("mid")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Terminal ID(TID)</label>
              <input
                {...register("tid")}
                type="tel"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ghi chú</label>
              <textarea
                {...register("note")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới hạn quẹt tiền mỗi ngày</label>
              <CurrencyFormat
                type="text"
                className="form-control"
                required
                thousandSeparator={true}
                onChange={handleOnChangeMoneyLimitPerDay}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Trạng thái</label>
              <select
                {...register("status", { required: true })}
                className="form-select"
              >
                {posStatus?.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
              {/* {errors.status && <p style={{ color: "red"}}>This is required.</p>} */}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("bank_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              <select
                {...register("store", { required: true })}
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
