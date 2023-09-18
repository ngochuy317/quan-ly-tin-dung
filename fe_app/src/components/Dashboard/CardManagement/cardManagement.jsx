import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import cardManagementAPI from "../../../api/cardManagementAPI";
import InputField from "../../Common/inputField";
import Spinner from "../../Common/spinner";
import HistoryCreditCardModal from "../../Modal/historyCreditCardModal";
import Pagination from "../../Pagination/pagination";

function CardManagement() {
  const [dataCard, setDataCard] = useState([]);
  const [dataTableHistoryCreditCard, setDataTableHistoryCreditCard] = useState(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { register, handleSubmit, setValue, formState } = useForm();
  const { isSubmitting } = formState;
  const [params, setParams] = useState({ page: 1 });
  const [show, setShow] = useState(false);
  const [titleModal, setTitleModal] = useState("");

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function initData() {
      try {
        const response = await cardManagementAPI.getAll(params);
        console.log("Fetch creditcard successfully", response);
        setDataCard(response);
      } catch (error) {
        console.log("Failed to fetch creditcard", error);
      }
    }

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleOnClickCreditCard = async (e) => {
    try {
      e.preventDefault();
      let cardNumber = e.target.innerText;
      const response = await cardManagementAPI.getAllTransaction4CreditCard(
        cardNumber
      );
      console.log("Fetch creditcard successfully", response);
      setDataTableHistoryCreditCard(response);
      setTitleModal(cardNumber);
      handleShow();
    } catch (error) {
      console.log("Failed to fetch creditcard", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("🚀 ~ file: cardManagement.jsx:59 ~ onSubmit ~ data:", data);
      const response = await cardManagementAPI.getAll({
        ...params,
        ...data,
      });
      setDataCard(response);
    } catch (error) {
      console.log("Failed to search creditcard", error);
    }
  };

  const onClickDeleteSearch = async () => {
    try {
      setValue("card_number", "");
      const response = await cardManagementAPI.getAll(params);
      console.log("Fetch creditcard successfully", response);
      setDataCard(response);
    } catch (error) {
      console.log("Failed to fetch creditcard", error);
    }
  };
  return (
    <div>
      <h2 className="text-center">Quản lý thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          requiredColWidth={3}
          requiredLbl="Số trên thẻ"
          requiredType="text"
          requiredRegister={register}
          requiredName={"card_number"}
        />
        <div className="d-flex justify-content-end">
          <button
            type="button"
            disabled={isSubmitting}
            className="btn btn-outline-primary mx-3"
            onClick={() => onClickDeleteSearch()}
          >
            {isSubmitting && <Spinner />}
            Xoá tìm kiếm
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-outline-primary mx-3"
          >
            {isSubmitting && <Spinner />}
            Tìm kiếm
          </button>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên trên thẻ</th>
              <th scope="col">Số thẻ</th>
              <th scope="col">Cửa hàng</th>
              <th scope="col">Số tiền</th>
              <th scope="col">Ngày quẹt</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {dataCard?.results?.map((data, index) => (
              <tr key={data.id}>
                <td>{index + 1}</td>
                <td>{data.card_name}</td>
                <td>
                  {" "}
                  <a
                    href="/#"
                    onClick={handleOnClickCreditCard}
                    style={{ cursor: "pointer" }}
                  >
                    {data.card_number}
                  </a>
                </td>
                <td>{data.store_name}</td>
                <td>{data.customer_money_needed?.toLocaleString("vn")}</td>
                <td>{data.transaction_datetime_created}</td>
                <td>
                  <Link to={data.creditcard_id + "/"}>Chỉnh sửa</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HistoryCreditCardModal
        show={show}
        handleClose={handleClose}
        title={titleModal}
        dataTableHistoryCreditCard={dataTableHistoryCreditCard}
      />
      <Pagination
        canBedisabled={dataCard?.results?.length ? false : true}
        currentPage={currentPage}
        totalPages={dataCard.total_pages}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default CardManagement;
