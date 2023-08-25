import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customerApi from "../../../api/customerAPI";
import Pagination from "../../Pagination/pagination";

function CustomerList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({ page: 1 });
  const [responseData, setResponseData] = useState({});

  useEffect(() => {
    const fetchCustomerList = async () => {
      try {
        const response = await customerApi.getAll(params);
        console.log("Fetch customer list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch customer list", error);
      }
    };

    fetchCustomerList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  return (
    <>
      <h2 className="text-center">Quản lý khách hàng</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên</th>
              <th scope="col">SĐT</th>
              <th scope="col">Số tài khoản</th>
              <th scope="col">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((customer, index) => (
              <tr key={customer.id}>
                <th scope="row">{index + 1}</th>
                <td>{customer.name}</td>
                <td>{customer.phone_number}</td>
                <td>{customer.bank_account?.account_number}</td>
                <td>
                  <Link to={customer.id + "/"}>Chỉnh sửa</Link>
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
    </>
  );
}

export default CustomerList;
