import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import notebookApi from "../../../api/notebookAPI";
import userApi from "../../../api/userAPI";
import Pagination from "../../Pagination/pagination";

function SavedCardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [idNotebook, setIdNotebook] = useState();
  const [notebooks, setNotebooks] = useState([]);
  const [rowNotebooks, setRowNotebooks] = useState([]);
  const { register, reset } = useForm();

  useEffect(() => {
    async function fetchEmployeeDetail() {
      try {
        const response = await userApi.getInformationDetail();
        console.log("Fetch information detail successfully", response);

        let initValues = {};
        initValues.store_name = response.store.name;
        initValues.store_code = response.store.code;
        initValues.store_id = response.store.id;
        initValues.store_phone_number = response.store.phone_number;
        initValues.store_address = response.store.address;
        reset({ ...initValues });
        if (response.store.notebooks) {
          setNotebooks(response.store.notebooks);
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []); // eslint-disable-line

  const handleChangePage = async (direction) => {
    setCurrentPage(currentPage + direction);
    const response = await notebookApi.getDetailRowNotebook(idNotebook, {
      page: currentPage + direction,
    });
    console.log("Fetch detail rownotebook successfully", response);
    setRowNotebooks(response);
  };

  const handleOnChangeNotebook = async (e) => {
    let id = parseInt(e.target.value);
    const response = await notebookApi.getDetailRowNotebook(id, { page: 1 });
    console.log("Fetch detail rownotebook successfully", response);
    setIdNotebook(id);
    setRowNotebooks(response);
  };

  return (
    <div>
      <h2 className="text-center">Danh sách thẻ đã lưu</h2>
      <h5>Cửa hàng</h5>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng</label>
            <input
              {...register("store_name")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Địa chỉ</label>
            <input
              {...register("store_address")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              {...register("store_phone_number")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
      </div>
      <h5>Sổ lưu thẻ</h5>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Sổ lưu thẻ</label>
            <select
              {...register("notebook")}
              className="form-select"
              disabled={notebooks.length > 0 ? null : true}
              onChange={handleOnChangeNotebook}
            >
              <option></option>
              {notebooks?.map((notebook) => (
                <option key={notebook.id} value={notebook.id}>
                  {notebook.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày giờ lưu</th>
              <th scope="col">Số dư cuối kì</th>
              <th scope="col">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {rowNotebooks?.results?.map((rowNotebook, index) => (
              <tr key={rowNotebook.id}>
                <th scope="row">{index + 1}</th>
                <td>{rowNotebook.status}</td>
                <td>{rowNotebook.storage_datetime}</td>
                <td>{rowNotebook.closing_balance}</td>
                <td>{rowNotebook.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={rowNotebooks.total_pages}
          handleChangePage={handleChangePage}
        />
      </div>
    </div>
  );
}

export default SavedCardList;
