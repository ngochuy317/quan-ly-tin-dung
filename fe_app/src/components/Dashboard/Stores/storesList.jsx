import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import Pagination from "../../Pagination/pagination";

function StoresList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchStoreList = async () => {
      try {
        const response = await storeApi.getAll(params);
        console.log("Fetch stores list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch stores list", error);
      }
    };

    fetchStoreList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const onDelete = async (id) => {
    try {
      const response = await storeApi.deleteOne(id);
      console.log("Delete store successfully", response);
      setParams({ ...params });
    } catch (error) {
      console.log("Failed to delete store", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Danh sách cửa hàng</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên ghi nhớ</th>
              <th scope="col">Ghi chú</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((store, index) => (
              <tr key={store.id}>
                <th scope="row">{index + 1}</th>
                <td>{store.name}</td>
                <td>{store.note}</td>
                <td>{store.address}</td>
                <td>{store.phone_number}</td>
                <td>
                  <Link to={store.id + "/"}>Chỉnh sửa</Link>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(store.id)}
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

export default StoresList;
