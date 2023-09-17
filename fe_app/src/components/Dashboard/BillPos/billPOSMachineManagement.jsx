import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import billPOSApi from "../../../api/billPOSAPI";
import storeApi from "../../../api/storeAPI";
import RequiredSymbol from "../../Common/requiredSymbol";
import {
  ADMIN,
  BILLPOSRECEIVEMONEY,
  COLORBILLPOS,
  MAMANGER,
} from "../../ConstantUtils/constants";
import BillPosReceiveMoneyConfirmModal from "../../Modal/billPosReceiveMoneyConfirmModal";
import ShowErrorModal from "../../Modal/showErrorModal";
import Pagination from "../../Pagination/pagination";
import { AuthContext } from "../dashboard";

function BillPOSMachineMangement() {
  const { role = "" } = React.useContext(AuthContext);

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      datetime_created_after: new Date(Date.now() - 86400000)
        .toISOString()
        .substring(0, 10),
      datetime_created_before: new Date().toISOString().substring(0, 10),
    },
  });

  const [stores, setStores] = useState([]);
  const [poses, setPoses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [
    dataBillPosReceiveMoneyConfirmModal,
    setDataBillPosReceiveMoneyConfirmModal,
  ] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [billPosReceiveMoney, setBillPosReceiveMoney] = useState(1);
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

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleClose = () => setShow(false);
  const handleConfirm = async (e, id) => {
    e.preventDefault();
    try {
      const response = await billPOSApi.updateOne(id, {
        receive_money: billPosReceiveMoney,
      });
      console.log(
        "🚀 ~ file: billPOSMachineManagement.jsx:49 ~ handleConfirm ~ id:",
        id
      );
      console.log(
        "🚀 ~ file: billPOSMachineManagement.jsx:51 ~ handleConfirm ~ response:",
        response
      );
      setShow(false);
      handleChangePage(0);
    } catch (error) {
      setShow(false);
      setErrorMsg("Đã có lỗi xảy ra. Vui lòng thử lại");
      setShowErrorModal(true);
      console.log("Failed to confirm money reiceive", error);
    }
  };

  const handleShowModal = (e, id, transactionTime, receive_money) => {
    console.log(
      "🚀 ~ file: billPOSMachineManagement.jsx:70 ~ handleShowModal ~ data:",
      id,
      transactionTime,
      receive_money
    );
    e.preventDefault();
    setDataBillPosReceiveMoneyConfirmModal({
      id: id,
      transactionTime: transactionTime,
      receive_money: receive_money,
    });
    setShow(true);
    console.log(
      "🚀 ~ file: billPOSMachineManagement.jsx:83 ~ handleShowModal ~ dataBillPosReceiveMoneyConfirmModal:",
      dataBillPosReceiveMoneyConfirmModal
    );
  };

  const onSubmit = async (data) => {
    console.log(
      "🚀 ~ file: billPOSMachineManagement.jsx:97 ~ onSubmit ~ data:",
      data
    );
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

  const onChangeBillPosStatus = (e) => {
    console.log(
      "🚀 ~ file: billPOSMachineManagement.jsx:79 ~ BillPOSMachineMangement ~ e:",
      e.target.value
    );
    setBillPosReceiveMoney(e.target.value);
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
              <label className="form-label">
                Cửa hàng
                <RequiredSymbol />
              </label>
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
          <div className="col-md-3">
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
                    {pos.name}-{pos.mid}-{pos.tid}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Từ ngày
                <RequiredSymbol />
              </label>
              <input
                {...register("datetime_created_after")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Đến ngày
                <RequiredSymbol />
              </label>
              <input
                {...register("datetime_created_before")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Tiền về</label>
              <select {...register("receive_money")} className="form-select">
                <option value="">Tất cả</option>
                <option value={true}>Tiền về</option>
                <option value={false}>Tiền chưa về</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Bill hợp lệ</label>
              <select {...register("valid")} className="form-select">
                <option value="">Tất cả</option>
                <option value={true}>Bill hợp lệ</option>
                <option value={false}>Bill chưa hợp lệ</option>
              </select>
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
              <th scope="col">Số tham chiếu</th>
              <th scope="col">Số hoá đơn</th>
              <th scope="col">Số lô</th>
              <th scope="col">Mã chuẩn chi</th>
              <th scope="col">Nhân viên</th>
              <th scope="col">Tiền về</th>
              <th scope="col">Hợp lệ</th>
              {(role === ADMIN || role === MAMANGER) && (
                <th scope="col">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseBillPOSMachine?.results?.map((billPos, index) => (
              <tr
                key={billPos.id}
                className={
                  billPos.valid === false
                    ? COLORBILLPOS["red"]
                    : billPos.receive_money
                    ? COLORBILLPOS["green"]
                    : COLORBILLPOS["yellow"]
                }
              >
                <th scope="row">{index + 1}</th>
                <td>{billPos.datetime_created}</td>
                <td>
                  <Link
                    to={billPos.bill_image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem
                  </Link>
                </td>
                <td>{billPos.total_money?.toLocaleString("vn")}</td>
                <td>{billPos.ref_no}</td>
                <td>{billPos.invoice_no}</td>
                <td>{billPos.batch}</td>
                <td>{billPos.authorization_code}</td>
                <td>{billPos.emp_name}</td>
                <td>
                  {billPos.valid === true &&
                    (billPos.receive_money ? "Đã về" : "Chưa về")}
                </td>
                <td>{billPos.valid ? "Hợp lệ" : "Không hợp lệ"}</td>
                {(role === ADMIN || role === MAMANGER) && (
                  <td>
                    {billPos.valid === true && (
                      <a
                        href="/#"
                        onClick={(e) =>
                          handleShowModal(
                            e,
                            billPos.id,
                            billPos.datetime_created,
                            billPos.receive_money
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Xác nhận tiền về
                      </a>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <BillPosReceiveMoneyConfirmModal
          requiredShow={show}
          requiredHandleClose={handleClose}
          requiredDataBillPosReceiveMoneyConfirmModal={
            dataBillPosReceiveMoneyConfirmModal
          }
          requiredHandleConfirm={handleConfirm}
          requiredData={BILLPOSRECEIVEMONEY}
          requiredOnChange={onChangeBillPosStatus}
        />
      </div>
      <ShowErrorModal
        show={showErrorModal}
        handleClose={handleCloseErrorModal}
        msg={errorMsg}
      />
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
