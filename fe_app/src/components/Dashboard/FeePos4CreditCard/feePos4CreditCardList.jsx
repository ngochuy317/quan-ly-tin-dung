import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import feePOS4CreditCardAPI from "../../../api/feePOS4CreditCardAPI";
import Pagination from "../../Pagination/pagination";

FeePos4CreditCardList.propTypes = {};

function FeePos4CreditCardList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchFeePOS4CreditCardList = async () => {
      try {
        const response = await feePOS4CreditCardAPI.getAll(params);
        console.log("Fetch fee pos 4 credit card list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch fee pos 4 credit card list", error);
      }
    };

    fetchFeePOS4CreditCardList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <div>
      <h2 className="text-center">Danh sách phí cho thẻ tín dụng</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Loại</th>
              <th scope="col">Phí</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((fee, index) => (
              <tr key={fee.id}>
                <td>{index + 1}</td>
                <td>{fee.type}</td>
                <td>{fee.fee}</td>
                <td>
                  <Link to={fee.id + "/"}>Chỉnh sửa</Link>
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

export default FeePos4CreditCardList;
