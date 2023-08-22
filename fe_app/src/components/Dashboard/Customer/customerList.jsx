import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import customerApi from "../../../api/customerAPI";
import CustomerDetailModal from "../../Modal/customerDetailModal";
import Pagination from "../../Pagination/pagination";
import { formatDataFileField } from "../../Utilities/fileField";

function CustomerList() {
  const { register, formState, reset, getValues } = useForm();

  const { isSubmitting } = formState;
  const [currentPage, setCurrentPage] = useState(1);
  const [params, setParams] = useState({ page: 1 });
  const [responseData, setResponseData] = useState({});
  const [show, setShow] = useState(false);

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUpdateCustomerDetail = async (e, id) => {
    try {
      let newData;
      let data = getValues();
      newData = formatDataFileField(data, [
        "id_card_front_image",
        "id_card_back_image",
      ]);
      console.log("🚀 ~ file: customerList.jsx:45 ~ handleUpdateCustomerDetail ~ newData:", newData)
      const response = await customerApi.updateOne(id, newData);
      console.log(
        "🚀 ~ file: customerList.jsx:48 ~ handleUpdateCustomerDetail ~ response:",
        response
      );
      handleClose();
      setParams({...params})
    } catch (error) {
      console.log("Failed to update customer detail", error);
    }
  };

  const handleOnClickCustomer = async (e) => {
    try {
      e.preventDefault();
      let customerId = e.target?.querySelector("input")?.value;
      const response = await customerApi.getDetail(customerId);
      console.log("Fetch customer detail successfully", response);
      reset({ ...response });
      handleShow();
    } catch (error) {
      console.log("Failed to fetch customer detail", error);
    }
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
                  <a
                    href="/#"
                    onClick={handleOnClickCustomer}
                    style={{ cursor: "pointer" }}
                  >
                    <input hidden readOnly value={customer.id} />
                    Xem
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CustomerDetailModal
        requiredShow={show}
        requiredHandleClose={handleClose}
        requiredHandleUpdateCustomerDetail={handleUpdateCustomerDetail}
        requiredRegister={register}
        requiredGetValues={getValues}
        requiredIsSubmitting={isSubmitting}
      />
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
