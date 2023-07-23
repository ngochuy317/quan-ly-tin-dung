import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import notebookApi from "../../../api/notebookAPI";
import Pagination from "../../Pagination/pagination";

function NotebooksList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchNotebookList = async () => {
      try {
        const response = await notebookApi.getAll(params);
        console.log("Fetch notebooks list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch notebooks list", error);
      }
    };

    fetchNotebookList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const onDelete = async (id) => {
    try {
      const response = await notebookApi.deleteOne(id);
      console.log("Delete notebook successfully", response);
      setParams({ ...params });
    } catch (error) {
      console.log("Failed to delete notebook", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Danh sách sổ lưu</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              {/* <th scope="col">Tên sổ</th> */}
              <th scope="col">Tên sổ</th>
              <th scope="col">Số trang</th>
              <th scope="col">Số thẻ trên 1 trang</th>
              <th scope="col">Cửa hàng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((notebook, index) => (
              <tr key={notebook.id}>
                <th scope="row">{index + 1}</th>
                <td>{notebook.name}</td>
                <td>{notebook.pages}</td>
                <td>{notebook.capacity_per_page}</td>
                <td>
                  <Link to={"/dashboard/stores/" + notebook.store.id}>
                    {notebook.store_name}
                  </Link>
                </td>
                <td>
                  <Link to={notebook.id + "/"}>Chỉnh sửa</Link>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(notebook.id)}
                    className="btn btn-outline-danger mx-3"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        canBedisabled={responseData?.results?.length ? false : true}
        currentPage={currentPage}
        totalPages={responseData.total_pages}
        handleChangePage={handleChangePage}
      />
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-outline-primary">
          <Link to="add" style={{ textDecoration: "none", color: "inherit" }}>
            Thêm
          </Link>
        </button>
      </div>
    </div>
  );
}

export default NotebooksList;
