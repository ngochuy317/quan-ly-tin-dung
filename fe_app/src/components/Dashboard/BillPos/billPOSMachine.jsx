import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
BillPOSMachine.propTypes = {};

function BillPOSMachine(props) {
  const { register, handleSubmit, getValues } = useForm();
  const [stores, setStores] = useState([]);
  const [poses, setPoses] = useState([]);

  const handleOnChange = (e) => {
    let val = parseInt(e.target.value);
    if (val) {
      let store = stores.find((c) => c.id === val);
      setPoses([...store.poses]);
    } else {
      setPoses([]);
    }
  };
  return (
    <div>
      <h2 className="text-center">Quản lý hoá đơn máy POS</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Cửa hàng</label>
            {
              <select
                // {...register("store_id")}
                className="form-select"
                onChange={handleOnChange}
                required
              >
                <option value="">Chọn cửa hàng</option>
                {stores?.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            }
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Máy POS</label>
            <select
              //   {...register("pos")}
              className="form-select"
              disabled={poses.length > 0 ? null : true}
            >
              <option value="">Tất cả</option>
              {poses?.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Ngày giao dịch</label>
            <input
              //   {...register("transaction_datetime_created")}
              type="date"
              className="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPOSMachine;
