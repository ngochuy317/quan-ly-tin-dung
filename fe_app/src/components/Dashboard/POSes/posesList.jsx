import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import posApi from "../../../api/posAPI";
import Pagination from "../../Pagination/pagination";
import { POSSTATUS } from "../../ConstantUtils/constants";
import Spinner from "../../Common/spinner";

function POSesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [spinner, setSpinner] = useState(true);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchPOSList = async () => {
      try {
        const response = await posApi.getAll(params);
        console.log("Fetch poses list successfully", response);

        setResponseData(response);
        setSpinner(false);
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

  const onDelete = async (id) => {
    try {
      const response = await posApi.deleteOne(id);
      console.log("Delete pos successfully", response);
      setParams({ ...params });
    } catch (error) {
      console.log("Failed to delete pos", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Danh sách máy POS</h2>
      <div className="table-responsive">
        {spinner ? (
          <Spinner />
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
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
              {responseData?.results?.map((pos, index) => (
                <tr key={pos.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{pos.mid}</td>
                  <td>{pos.tid}</td>
                  <td>
                    {pos.note.substring(0, 20)} {pos.note.length >= 20 && "..."}
                  </td>
                  <td>
                    {POSSTATUS.find((c) => c.value === pos.status)?.label}
                  </td>
                  <td>{pos.bank_name}</td>
                  <td>{pos.store_name}</td>
                  <td>
                    <Link to={pos.id + "/"}>Chỉnh sửa</Link>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => onDelete(pos.id)}
                      className="btn btn-outline-danger mx-3"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default POSesList;
