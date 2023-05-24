import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import storeApi from "../../../api/storeAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import Pagination from "../../Pagination/pagination";
import { AuthContext } from "../dashboard";

function Report() {
  const { role } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [poses, setPoses] = useState([]);
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({ page: 1 });
  const { register, handleSubmit } = useForm();

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

    fetchListStore();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      const response = await swipeCardTransactionAPI.getAll({
        ...params,
        ...data,
      });
      console.log("Get swipecard transaction successfully", response);
      setResponseSwipeCardData(response);
    } catch (error) {
      console.log("Failed to Get swipecard transaction", error);
    }
  };

  const handleOnChange = (e) => {
    let val = parseInt(e.target.value);
    let store = stores.find((c) => c.id === val);
    setPoses([...store.poses]);
    console.log("store", poses);
  };

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Thống kê</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              <select
                {...register("store_id", { required: true })}
                className="form-select"
                onChange={handleOnChange}
              >
                {stores &&
                  stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
              </select>
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
                {poses ? <option value="">Tất cả</option> : null}
                {poses &&
                  poses.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.pos_id}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngày giao dịch</label>
              <input
                {...register("transaction_datetime")}
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
      <h2 className="text-center">Lịch sử quẹt thẻ</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ngày giao dịch</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">SDT khách hàng</th>
              <th scope="col">Số tiền KH cần</th>
              <th scope="col">Phí</th>
              {/* <th scope="col">Thao tác</th> */}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseSwipeCardData.results &&
              responseSwipeCardData.results.map((swipeCard, index) => (
                <tr key={swipeCard.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{swipeCard.transaction_datetime}</td>
                  <td>{swipeCard.customer_name}</td>
                  <td>{swipeCard.customer_phone_number}</td>
                  <td>{swipeCard.customer_money_needed.toLocaleString("vn")}</td>
                  <td>{swipeCard.fee}</td>
                  {/* <td>
                    <Link to={swipeCard.id + "/"}>Chỉnh sửa</Link>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {responseSwipeCardData.results ? (
        <div className="d-flex justify-content-end">
          Tổng tiền: {responseSwipeCardData.sum_customer_money_needed.toLocaleString("vn")}
        </div>
      ) : <div></div>}
      <Pagination
        currentPage={currentPage}
        totalPages={responseSwipeCardData.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default Report;
