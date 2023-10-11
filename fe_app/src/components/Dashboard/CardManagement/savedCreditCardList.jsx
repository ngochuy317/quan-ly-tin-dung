import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import storeApi from "../../../api/storeAPI";
import RequiredSymbol from "../../Common/requiredSymbol";
import Pagination from "../../Pagination/pagination";

SavedCreditCardList.propTypes = {};

function SavedCreditCardList() {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      datetime_created_after: new Date(Date.now())
        .toISOString()
        .substring(0, 10),
      datetime_created_before: new Date(Date.now() + 86400000 * 5)
        .toISOString()
        .substring(0, 10),
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewBtnEnable, setViewBtnEnable] = useState(false);
  const [rowNotebooks, setRowNotebooks] = useState([]);
  const [stores, setStores] = useState([]);
  const [params, setParams] = useState({ page: 1 });

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

  const handleOnClickFiveDays = (e) => {
    e.preventDefault();
    setValue(
      "datetime_created_after",
      new Date(Date.now()).toISOString().substring(0, 10)
    );
    setValue(
      "datetime_created_before",
      new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10)
    );
  };

  const handleOnClickTenDays = (e) => {
    e.preventDefault();
    setValue(
      "datetime_created_after",
      new Date(Date.now()).toISOString().substring(0, 10)
    );
    setValue(
      "datetime_created_before",
      new Date(Date.now() + 86400000 * 10).toISOString().substring(0, 10)
    );
  };

  const handleOnChangeStore = (e) => {
    if (e.target.value) {
      setViewBtnEnable(true);
    } else {
      setViewBtnEnable(false);
    }
  };

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const onSubmit = async (data) => {};
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              {
                <select
                  {...register("store_id")}
                  className="form-select"
                  onChange={handleOnChangeStore}
                  required
                >
                  <option value="">Chọn cửa hàng</option>
                  <option value="all">Tất cả</option>

                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              }
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
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label" style={{ color: "white" }}>
                White
              </label>
              <button
                className="btn btn-outline-primary mx-3 form-control"
                onClick={handleOnClickFiveDays}
              >
                5 ngày
              </button>
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label" style={{ color: "white" }}>
                White
              </label>
              <button
                className="btn btn-outline-primary mx-3 form-control"
                onClick={handleOnClickTenDays}
              >
                10 ngày
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn btn-outline-primary mx-3"
            disabled={!viewBtnEnable}
          >
            Xem
          </button>
        </div>
      </form>
      <h2 className="text-center">Dach sách thẻ đã lưu</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày giờ lưu</th>
              <th scope="col">Số dư cuối kì</th>
              <th scope="col">Đã đáo</th>
              <th scope="col">Ngày cuối</th>
              <th scope="col">Tiền về</th>
              <th scope="col">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {rowNotebooks?.map((rowNotebook, index) => (
              <tr key={rowNotebook.id}>
                <th scope="row">{index + 1}</th>
                <td>{rowNotebook.status}</td>
                <td>{rowNotebook.storage_datetime}</td>
                <td>{rowNotebook.closing_balance}</td>
                <td>{rowNotebook.closing_balance}</td>
                <td>{rowNotebook.last_date}</td>
                <td>{rowNotebook.is_payment_received}</td>
                <td>{rowNotebook.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        canBedisabled={rowNotebooks?.results?.length ? false : true}
        currentPage={currentPage}
        totalPages={rowNotebooks.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default SavedCreditCardList;
