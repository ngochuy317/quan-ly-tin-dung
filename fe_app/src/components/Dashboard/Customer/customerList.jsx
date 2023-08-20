import React, { useState, useEffect } from "react";
import customerApi from "../../../api/customerAPI";
import Pagination from "../../Pagination/pagination";

function CustomerList() {
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
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((customer, index) => (
              <tr key={customer.id}>
                <th scope="row">{index + 1}</th>
                <td>{customer.name}</td>
                <td>{customer.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CustomerList;
