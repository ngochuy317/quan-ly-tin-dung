import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import posApi from "../../../api/posAPI";
import Pagination from "../../Pagination/pagination";

function POSesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchPOSList = async () => {
      try {
        const response = await posApi.getAll(params);
        console.log("Fetch poses list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch poses list", error);
      }
    };

    fetchPOSList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Danh sách máy POS</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Pos Id</th>
              <th scope="col">Mid</th>
              <th scope="col">Tid</th>
              <th scope="col">Ghi chú</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngân hàng</th>
              <th scope="col">Cửa hàng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData.results &&
              responseData.results.map((pos, index) => (
                <tr key={pos.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{pos.pos_id}</td>
                  <td>{pos.mid}</td>
                  <td>{pos.tid}</td>
                  <td>{pos.note}</td>
                  <td>{pos.status}</td>
                  <td>{pos.bank_name}</td>
                  <td>{pos.store_name}</td>
                  <td>
                    <Link to={pos.id + "/"}>Chỉnh sửa</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
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

export default POSesList;
