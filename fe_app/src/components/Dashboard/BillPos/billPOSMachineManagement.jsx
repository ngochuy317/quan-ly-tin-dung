import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import billPOSApi from "../../../api/billPOSAPI";
import storeApi from "../../../api/storeAPI";
import { ADMIN } from "../../ConstantUtils/constants";
import Pagination from "../../Pagination/pagination";
import { AuthContext } from "../dashboard";

function BillPOSMachineMangement(props) {
  const { role = "" } = React.useContext(AuthContext);

  const { register, handleSubmit, getValues } = useForm();
  const [stores, setStores] = useState([]);
  const [poses, setPoses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({ page: 1 });
  const [responseBillPOSMachine, setResponseBillPOSMachine] = useState([]);

  useEffect(() => {
    async function fetchListStore() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);
        setStores(responseJSONStore);
      } catch (error) {
        console.log("Failed to fetch notebook detail", error);
      }
    }
    if (role === ADMIN) {
      fetchListStore();
    }
  }, [role]);

  const onSubmit = async (data) => {
    try {
      const response = await billPOSApi.getAll({
        ...params,
        ...data,
      });
      setResponseBillPOSMachine(response);
      console.log(
        "🚀 ~ file: billPOSMachineManagement.jsx:37 ~ onSubmit ~ response:",
        response
      );
    } catch (error) {
      console.log("Failed to Get Bill POS machine", error);
    }
  };

  const handleChangePage = async (direction) => {
    let dataForm = getValues();
    try {
      const response = await billPOSApi.getAll({
        page: currentPage + direction,
        ...dataForm,
      });
      console.log("Get Bill POS machine successfully", response);
      setResponseBillPOSMachine(response);
    } catch (error) {
      console.log("Failed to Get Bill POS machine", error);
    }
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              {role === ADMIN ? (
                <select
                  {...register("store_id")}
                  className="form-select"
                  onChange={handleOnChange}
                  disabled={stores.length > 0 ? null : true}
                  required
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register("store_name")}
                  type="text"
                  className="form-control"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Máy POS</label>
              <select
                {...register("pos")}
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
                {...register("datetime_created")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary mx-3">
            Xem
          </button>
        </div>
      </form>
      <h2 className="text-center">Bill máy POS</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Hình bill</th>
              <th scope="col">Số tiền</th>
              <th scope="col">Tiền về</th>
              <th scope="col">Số tham chiếu</th>
              <th scope="col">Số hoá đơn</th>
              <th scope="col">Số lô</th>
              <th scope="col">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseBillPOSMachine?.results?.map((billPos, index) => (
              <tr key={billPos.id}>
                <th scope="row">{index + 1}</th>
                <td>{billPos.datetime_created}</td>
                <td>
                  <Link to={billPos.bill_image} target="_blank">
                    Xem
                  </Link>
                </td>
                <td>{billPos.total_money?.toLocaleString("vn")}</td>
                <td>{billPos.is_payment_received ? "Đã về" : "Chưa về"}</td>
                <td>{billPos.ref_no}</td>
                <td>{billPos.invoice_no}</td>
                <td>{billPos.batch}</td>
                <td>{billPos.active? "Hoạt động" : "Đã xoá"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        canBedisabled={responseBillPOSMachine?.results?.length ? false : true}
        currentPage={currentPage}
        totalPages={responseBillPOSMachine?.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default BillPOSMachineMangement;
