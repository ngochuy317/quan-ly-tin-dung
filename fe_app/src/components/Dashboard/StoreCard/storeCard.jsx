import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import creditCardApi from "../../../api/creditCardAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import userApi from "../../../api/userAPI";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Pagination/pagination";
import notebookApi from "../../../api/notebookAPI";

function StoreCard() {
  const { register, handleSubmit, reset, formState, setValue } = useForm();
  const { isSubmitting } = formState;
  const [notebooks, setNotebooks] = useState([]);
  const [responseSwipeCardData, setResponseSwipeCardData] = useState([]);
  const [rowNotebooks, setRowNotebooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxLengthOrderInNotebook, setMaxLengthOrderInNotebook] = useState(0);
  const [reloadAfterSubmit, setReloadAfterSubmit] = useState(false);
  const [params, setParams] = useState({ page: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployeeDetail() {
      try {
        const response = await userApi.getInformationDetail();
        console.log("Fetch information detail successfully", response);

        let initValues = {};
        initValues.store_name = response.store.name;
        initValues.store_code = response.store.code;
        initValues.store_id = response.store.id;
        initValues.store_phone_number = response.store.phone_number;
        initValues.store_address = response.store.address;
        reset({ ...initValues });
        if (response.store.notebooks) {
          setNotebooks(response.store.notebooks);
          // setRowNotebooks(response.store.notebooks[0].row_notebook);
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []); // eslint-disable-line

  useEffect(() => {
    async function fetchTransactionHistory() {
      try {
        const responseHistorySwipeCard = await swipeCardTransactionAPI.getAll();
        console.log(
          "Fetch swipe card history list successfully",
          responseHistorySwipeCard
        );
        setResponseSwipeCardData(responseHistorySwipeCard.results);
        if (responseHistorySwipeCard.results.length > 0) {
          setValue(
            "creditcard.card_number",
            responseHistorySwipeCard.results[0].creditcard?.card_number
          );
          setValue(
            "creditcard.card_name",
            responseHistorySwipeCard.results[0].creditcard?.card_name
          );
        }
      } catch (error) {
        console.log("Failed to swipe card history", error);
      }
    }
    fetchTransactionHistory();
  }, [reloadAfterSubmit]);

  const onSubmit = async (data) => {
    try {
      data.creditcard.credit_card_front_image =
        data.creditcard.credit_card_front_image[0];
      data.creditcard.credit_card_back_image =
        data.creditcard.credit_card_back_image[0];
      data.is_creditcard_stored = true;
      console.log("data", data);
      const response = await creditCardApi.saveCreditCard2Notebook(data);
      console.log("Save creditcard 2 notebook successfully", response);
      setReloadAfterSubmit(!reloadAfterSubmit);
      reset({
        creditcard: {
          card_number: "",
          card_bank_name: "",
          line_of_credit: "",
          card_name: "",
          card_issued_date: "",
          card_expire_date: "",
          card_ccv: "",
          credit_card_front_image: "",
          credit_card_back_image: "",
        },
        maturity_date: "",
        statement_date: "",
        status: "",
        closing_balance: "",
        note: "",
        last_date: "",
      });
    } catch (error) {
      console.log("Failed to save creditcard 2 notebook");
    }
  };

  const handleOnChangeNotebook = async (e) => {
    let val = parseInt(e.target.value);
    let notebook = notebooks.find((c) => c.id === val);
    setMaxLengthOrderInNotebook(notebook?.capacity);
    let id = parseInt(e.target.value);
    const response = await notebookApi.getDetailRowNotebook(id, { page: 1 });
    console.log("Fetch detail rownotebook successfully", response);
    setRowNotebooks(response?.results);
  };

  const handleOnChangeTransaction = (e) => {
    let val = parseInt(e.target.value);
    let swipeCardData = responseSwipeCardData.find((c) => c.id === val);
    setValue("creditcard.card_number", swipeCardData?.creditcard?.card_number);
    setValue("creditcard.card_name", swipeCardData?.creditcard?.card_name);
  };

  // const handleChangePage = (direction) => {
  //   setParams({ page: currentPage + direction });
  //   setCurrentPage(currentPage + direction);
  // };

  const handleNavigateSwipecard = () => {
    let path = "/dashboard/swipecard";
    navigate(path);
    localStorage.setItem("activeTab", path);
  };

  return (
    <div>
      <h2 className="text-center">Lưu thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Tên cửa hàng</label>
              <input
                {...register("store_name")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("store_address")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("store_phone_number")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>
        <h5>Sổ lưu thẻ</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Sổ lưu thẻ</label>
              <select
                {...register("notebook")}
                className="form-select"
                disabled={notebooks.length > 0 ? null : true}
                onChange={handleOnChangeNotebook}
                required
              >
                <option value="">Chọn Sổ lưu</option>
                {notebooks?.map((notebook) => (
                  <option key={notebook.id} value={notebook.id}>
                    {notebook.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Thẻ chưa lưu</label>
              <select
                {...register("creditcard_id")}
                className="form-select"
                disabled={creditcards.length > 0 ? null : true}
                onChange={handleOnChangeCreditCard}
              >
                {creditcards &&
                  creditcards.map((creditcard) => (
                    <option key={creditcard.id} value={creditcard.id}>
                      {creditcard.id}
                    </option>
                  ))}
              </select>
            </div>
          </div> */}
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Trạng thái{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("status")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số dư cuối kì</label>
              <input
                {...register("closing_balance")}
                type="number"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ghi chú</label>
              <input
                {...register("note")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngăn chứa thẻ</label>
              <input
                {...register("card_location")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số thứ tự trên sổ</label>
              <input
                {...register("order_in_notebook")}
                type="number"
                className="form-control"
                max={maxLengthOrderInNotebook}
                required
                placeholder={
                  maxLengthOrderInNotebook > 0
                    ? "Tối đa " + maxLengthOrderInNotebook
                    : null
                }
              />
            </div>
          </div>
        </div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số thẻ</label>
              <input
                {...register("creditcard.card_number")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("creditcard.card_bank_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hạn mức thẻ</label>
              <input
                {...register("creditcard.line_of_credit")}
                type="number"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Phí</label>
              <input
                {...register("fee")}
                type="number"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên trên thẻ</label>
              <input
                {...register("creditcard.card_name")}
                type="text"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày mở thẻ</label>
              <input
                {...register("creditcard.card_issued_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày hết hạn</label>
              <input
                {...register("creditcard.card_expire_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">CCV</label>
              <input
                {...register("creditcard.card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày sao kê</label>
              <input
                {...register("statement_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày cuối đáo</label>
              <input
                {...register("maturity_date")}
                type="date"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt trước thẻ tín dụng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.credit_card_front_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt sau thẻ tín dụng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.credit_card_back_image")}
                type="file"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div className="mb-3">
              <label className="form-label">
                Giao dịch{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <select
                {...register("transaction_id")}
                className="form-select"
                disabled={responseSwipeCardData.length > 0 ? null : true}
                required
                onChange={handleOnChangeTransaction}
              >
                {responseSwipeCardData?.map((swipeCardTransaction) => (
                  <option
                    key={swipeCardTransaction.id}
                    value={swipeCardTransaction.id}
                  >
                    {swipeCardTransaction.transaction_datetime_created}--
                    {swipeCardTransaction.customer_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">
                Ngày cuối{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("last_date")}
                type="number"
                className="form-control"
                min={1}
                max={31}
                required
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-outline-primary mx-1"
            onClick={handleNavigateSwipecard}
          >
            Trừ đáo
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary mx-3"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Lưu
          </button>
        </div>
        <h2 className="text-center">Danh sách thẻ</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Ngày giờ lưu</th>
                <th scope="col">Số dư cuối kì</th>
                <th scope="col">Đã đáo</th>
                <th scope="col">Ngày cuối</th>
                <th scope="col">Tiền về</th>
                <th scope="col">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {rowNotebooks?.map((rowNotebook, index) => (
                <tr key={rowNotebook.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{rowNotebook.status}</td>
                  <td>{rowNotebook.storage_datetime}</td>
                  <td>{rowNotebook.closing_balance}</td>
                  <td>{rowNotebook.closing_balance}</td>
                  <td>{rowNotebook.last_date}</td>
                  <td>{rowNotebook.is_payment_received}</td>
                  <td>{rowNotebook.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <Pagination
          currentPage={currentPage}
          totalPages={rowNotebooks.total_pages}
          handleChangePage={handleChangePage}
        /> */}
      </form>
    </div>
  );
}

export default StoreCard;
