import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import employeeApi from "../../../api/employeeAPI";
import Pagination from "../../Pagination/pagination";
import { genderChoices } from "../../ConstantUtils/constants";

function EmployeesList(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [responseData, setResponseData] = useState({});
  const [params, setParams] = useState({ page: 1 });

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const response = await employeeApi.getAll(params);
        console.log("Fetch employees list successfully", response);

        setResponseData(response);
      } catch (error) {
        console.log("Failed to fetch employees list", error);
      }
    };

    fetchEmployeeList();
  }, [params]);

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const onDelete = async (id) => {
    try {
      const response = await employeeApi.deleteOne(id);
      console.log("Delete employee successfully", response);
      setParams({ ...params });
    } catch (error) {
      console.log("Failed to delete employee", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Danh sách nhân viên</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Họ và Tên</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">CMND</th>
              <th scope="col">Giới tính</th>
              <th scope="col">Ngày sinh</th>
              <th scope="col">Lương</th>
              <th scope="col">Cửa hàng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {responseData?.results?.map((user, index) => (
                  <tr key={user.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.infomation_detail.fullname}</td>
                    <td>{user.infomation_detail.phone_number}</td>
                    <td>{user.infomation_detail.identity_card}</td>
                    <td>{genderChoices.find((c) => c.value === user.infomation_detail.gender)?.label}</td>
                    <td>{user.infomation_detail.dob}</td>
                    <td>{user.infomation_detail.salary}</td>
                    <td>{user.infomation_detail.store}</td>
                    <td>
                      <Link to={user.id + "/"}>Chỉnh sửa</Link>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => onDelete(user.id)}
                        className="btn btn-outline-danger mx-3"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              }
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

export default EmployeesList;
