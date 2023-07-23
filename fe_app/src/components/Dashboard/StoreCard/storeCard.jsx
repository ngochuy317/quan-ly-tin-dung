import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import userApi from "../../../api/userAPI";
// import Pagination from "../../Pagination/pagination";
import notebookApi from "../../../api/notebookAPI";
import { ADMIN, EMPLOYEE } from "../../ConstantUtils/constants";
import { AuthContext } from "../../Dashboard/dashboard";

function StoreCard() {
  const { register, handleSubmit, reset, formState, setValue, getValues } = useForm();
  const { isSubmitting } = formState;
  const [notebooks, setNotebooks] = useState([]);
  const [dataListCardNumber, setDataListCardNumber] = useState([]);
  const [rowNotebooks, setRowNotebooks] = useState([]);

  const [isManualInput, setIsManualInput] = useState(false);
  const [isCreditCardBackImage, setIsCreditCardBackImage] = useState(false);
  const [isCreditCardFrontImage, setIsCreditCardFrontImage] = useState(false);
  const [reloadAfterSubmit, setReloadAfterSubmit] = useState(false);
  const [searchCreditCard, setSearchCreditCard] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [maxLengthOrderInNotebook, setMaxLengthOrderInNotebook] = useState(0);
  // const [params, setParams] = useState({ page: 1 });
  const navigate = useNavigate();
  const { role = "" } = useContext(AuthContext);

  useEffect(() => {
    async function callAPIInit() {
      try {
        if (role === EMPLOYEE) {
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
        } else if (role === ADMIN) {
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    callAPIInit();
  }, [role]); // eslint-disable-line

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Send Axios request here
      const result = await creditCardApi.search({
        card_number: searchCreditCard,
      });
      console.log(
        "🚀 ~ file: swipeCardInput.jsx:112 ~ delayDebounceFn ~ result:",
        result
      );

      setDataListCardNumber([...result]);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCreditCard]);

  const handleOnChangeCardNumber = async (e) => {
    let event = e.nativeEvent.inputType ? "input" : "option selected";
    if (event === "input") {
      let val = e.target.value;
      if (val.length > 2) {
        setSearchCreditCard(val);
      }
    } else if (event === "option selected") {
      const card = dataListCardNumber.find(
        (c) => c.card_number === e.target.value
      );
      setValue("creditcard.card_bank_name", card.card_bank_name);
      setValue("creditcard.card_expire_date", card.card_expire_date);
      setValue("creditcard.card_issued_date", card.card_issued_date);
      setValue("creditcard.card_name", card.card_name);
      setValue(
        "creditcard.credit_card_back_image",
        card.credit_card_back_image
      );
      setValue(
        "creditcard.credit_card_front_image",
        card.credit_card_front_image
      );
      setValue("creditcard.maturity_date", card.maturity_date);
      setValue("creditcard.statement_date", card.statement_date);
      setValue("creditcard.line_of_credit", card.line_of_credit);
      setValue("creditcard.card_ccv", card.card_ccv);

      if (card?.credit_card_back_image) {
        setValue(
          "creditcard.credit_card_back_image",
          card.credit_card_back_image
        );
        setIsCreditCardBackImage(true);
      }
      if (card?.credit_card_front_image) {
        setValue(
          "creditcard.credit_card_front_image",
          card.credit_card_front_image
        );
        setIsCreditCardFrontImage(true);
      }
    }
  };

  const handleOnChangeManualInput = (e) => {
    let check = e.target.checked;
    setIsManualInput(check);
  };

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
              <label className="form-label">
                Số dư cuối kì{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
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
              <label className="form-label">
                Ngăn chứa thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
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
              <label className="form-label">
                Số thứ tự trên sổ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
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
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckManualInput"
            onChange={handleOnChangeManualInput}
          />
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckManualInput"
          >
            Nhập bằng tay
          </label>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Số thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_number")}
                type="text"
                className="form-control"
                required
                list="cardNumbers"
                id="myBrowser"
                placeholder="Nhập 3 số đầu để tìm"
                onChange={handleOnChangeCardNumber}
              />
              <datalist id="cardNumbers">
                {dataListCardNumber?.map((data, index) => (
                  <option value={data.card_number} key={index}></option>
                ))}
              </datalist>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Ngân hàng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_bank_name")}
                type="text"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Hạn mức thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.line_of_credit")}
                type="number"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Phí{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("fee")}
                type="number"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">
                Tên trên thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_name")}
                type="text"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày mở thẻ{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_issued_date")}
                type="date"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày hết hạn{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_expire_date")}
                type="date"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                CCV{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("creditcard.card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày sao kê{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("statement_date")}
                type="date"
                className="form-control"
                required
                disabled={!isManualInput}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ngày cuối đáo{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <input
                {...register("maturity_date")}
                type="date"
                className="form-control"
                required
                disabled={!isManualInput}
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
              {isCreditCardFrontImage ? (
                <img
                  src={`${getValues("creditcard.credit_card_front_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.credit_card_front_image")}
                  type="file"
                  className="form-control"
                  required
                  disabled={!isManualInput}
                />
              )}
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
              {isCreditCardBackImage ? (
                <img
                  src={`${getValues("creditcard.credit_card_back_image")}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <input
                  {...register("creditcard.credit_card_back_image")}
                  type="file"
                  className="form-control"
                  required
                  disabled={!isManualInput}
                />
              )}
            </div>
          </div>
        </div>
        <div className="row">
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
