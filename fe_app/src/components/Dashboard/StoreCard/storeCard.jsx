import React, { useContext, useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { FaAsterisk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import notebookApi from "../../../api/notebookAPI";
import storeApi from "../../../api/storeAPI";
import userApi from "../../../api/userAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import {
  ADMIN,
  EMPLOYEE,
  INPUTIMAGETYPEACCEPT,
  STATUSOFCARD,
} from "../../ConstantUtils/constants";
import { AuthContext } from "../../Dashboard/dashboard";
import Pagination from "../../Pagination/pagination";

function StoreCard() {
  const { register, handleSubmit, reset, formState, setValue } = useForm();
  const { isSubmitting } = formState;
  const [stores, setStores] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [params, setParams] = useState({ page: 1 });
  const [dataListCardNumber, setDataListCardNumber] = useState([]);
  const [rowNotebooks, setRowNotebooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isManualInput, setIsManualInput] = useState(false);
  const [hrefCreditCardBackImage, setHrefCreditCardBackImage] = useState("");
  const [hrefCreditCardFrontImage, setHrefCreditCardFrontImage] = useState("");
  const [hrefCustomerIDBackImage, setHrefCustomerIDBackImage] = useState("");
  const [hrefCustomerIDFrontImage, setHrefCustomerIDFrontImage] = useState("");
  // const [reloadAfterSubmit, setReloadAfterSubmit] = useState(false);
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
          const response = await storeApi.getAllFull();
          console.log("Fetch store data full successfully", response);
          setStores(response);
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    callAPIInit();
  }, [role]); // eslint-disable-line

  const handleChangePage = (direction) => {
    setParams({ page: currentPage + direction });
    setCurrentPage(currentPage + direction);
  };

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
      setValue("creditcard.customer.name", card.customer.name);
      setValue("creditcard.customer.phone_number", card.customer.phone_number);

      if (card?.customer?.id_card_back_image) {
        setValue(
          "creditcard.customer.id_card_back_image",
          card.customer.id_card_back_image
        );
        setHrefCustomerIDBackImage(card.customer.id_card_back_image);
      }
      if (card?.credit_card_front_image) {
        setValue(
          "creditcard.customer.credit_card_front_image",
          card.customer.credit_card_front_image
        );
        setHrefCustomerIDFrontImage(card.customer.credit_card_front_image);
      }

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
        setHrefCreditCardBackImage(card.credit_card_back_image);
      }
      if (card?.credit_card_front_image) {
        setValue(
          "creditcard.credit_card_front_image",
          card.credit_card_front_image
        );
        setHrefCreditCardFrontImage(card.credit_card_front_image);
      }
    }
  };

  const handleOnChangeManualInput = (e) => {
    let check = e.target.checked;
    setIsManualInput(check);
  };

  const handleOnChangeClosingBalance = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("closing_balance", val);
  };

  const onSubmit = async (data) => {
    try {
      // data.creditcard.credit_card_front_image =
      //   data.creditcard.credit_card_front_image[0];
      // data.creditcard.credit_card_back_image =
      //   data.creditcard.credit_card_back_image[0];

      if (typeof data.creditcard.credit_card_front_image === "string") {
        data.creditcard.credit_card_front_image = null;
      } else if (data.creditcard.credit_card_front_image) {
        data.creditcard.credit_card_front_image =
          data.creditcard.credit_card_front_image[0];
      }
      if (typeof data.creditcard.credit_card_back_image === "string") {
        data.creditcard.credit_card_back_image = null;
      } else if (data.creditcard.credit_card_back_image) {
        data.creditcard.credit_card_back_image =
          data.creditcard.credit_card_back_image[0];
      }

      if (typeof data.creditcard.customer.id_card_back_image === "string") {
        data.creditcard.customer.id_card_back_image = null;
      } else if (data.creditcard.customer.id_card_back_image) {
        data.creditcard.customer.id_card_back_image =
          data.creditcard.customer.id_card_back_image[0];
      }
      if (
        typeof data.creditcard.customer.credit_card_front_image === "string"
      ) {
        data.creditcard.customer.credit_card_front_image = null;
      } else if (data.creditcard.customer.credit_card_front_image) {
        data.creditcard.customer.credit_card_front_image =
          data.creditcard.customer.credit_card_front_image[0];
      }

      console.log("data", data);
      const response = await creditCardApi.saveCreditCard2Notebook(data);
      console.log("Save creditcard 2 notebook successfully", response);
      // setReloadAfterSubmit(!reloadAfterSubmit);
      setParams({ ...params });
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
          maturity_date: "",
          statement_date: "",
          customer: {
            name: "",
            phone_number: "",
            id_card_front_image: "",
            id_card_back_image: "",
          },
        },
        closing_balance: "",
        note: "",
        last_date: "",
        order_in_notebook: "",
        notebook: "",
        card_location: "",
      });
      setHrefCreditCardFrontImage("");
      setHrefCreditCardBackImage("");
      setHrefCustomerIDFrontImage("");
      setHrefCustomerIDBackImage("");
    } catch (error) {
      console.log("Failed to save creditcard 2 notebook");
    }
  };

  const handleOnChangeStore = async (e) => {
    let val = parseInt(e.target.value);
    if (val) {
      let store = stores.find((c) => c.id === val);
      let initDataStore = {};
      initDataStore.store_name = store.name;
      initDataStore.store_code = store.code;
      initDataStore.store_id = store.id;
      initDataStore.store_phone_number = store.phone_number;
      initDataStore.store_address = store.address;
      setValue("store_address", store?.address);
      setValue("store_phone_number", store?.phone_number);
      setNotebooks(store?.notebooks);
    } else {
      setValue("store_address");
      setValue("store_phone_number");
    }
  };

  const handleOnChangeNotebook = async (e) => {
    let val = parseInt(e.target.value);
    if (val) {
      let notebook = notebooks.find((c) => c.id === val);
      setMaxLengthOrderInNotebook(notebook?.capacity);
      let id = parseInt(e.target.value);
      const response = await notebookApi.getDetailRowNotebook(id, params);
      console.log("Fetch detail rownotebook successfully", response);
      setRowNotebooks(response?.results);
    } else {
      setRowNotebooks([]);
    }
  };

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
              {role === ADMIN ? (
                <select
                  {...register("store_name")}
                  className="form-select"
                  onChange={handleOnChangeStore}
                  disabled={stores.length > 0 ? null : true}
                  required
                >
                  <option value="">Chọn cửa hàng</option>
                  {stores?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store?.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register("store_name")}
                  type="text"
                  className="form-control"
                  disabled
                />
              )}
            </div>
          </div>
          <InputField
            requiredColWidth={4}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="store_address"
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Số điện thoại"
            requiredType="text"
            requiredRegister={register}
            requiredName="store_phone_number"
            optionalDisabled={true}
          />
        </div>
        <h5>Sổ lưu thẻ</h5>
        <div className="row">
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Sổ lưu thẻ"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"notebook"}
            requiredDataOption={notebooks}
            optionalLblSelect="Chọn Sổ lưu"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
            optionalOnChangeSelect={handleOnChangeNotebook}
            optionalDisable={notebooks.length > 0 ? false : true}
          />
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Trạng thái"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"status"}
            requiredDataOption={STATUSOFCARD}
            optionalDisable={true}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số dư cuối kì</label>
              <RequiredSymbol />
              <CurrencyFormat
                type="text"
                className="form-control"
                required
                thousandSeparator={true}
                onChange={handleOnChangeClosingBalance}
              />
            </div>
          </div>
          <InputTextareaField
            requiredColWidth={2}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Ngăn chứa thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName="card_location"
            requiredIsRequired={true}
          />
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Số thứ tự trên sổ <FaAsterisk color="red" size=".7em" />
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
        <h5>Thông tin khách hàng</h5>
        <div className="row">
          <InputField
            requiredColWidth={2}
            requiredLbl="Tên"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.name"}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"creditcard.customer.phone_number"}
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              {hrefCustomerIDFrontImage ? (
                <img
                  src={hrefCustomerIDFrontImage}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <span>Không có hình</span>
              )}
              {isManualInput && (
                <input
                  {...register("creditcard.customer.id_card_front_image")}
                  type="file"
                  className="form-control"
                  disabled={!isManualInput}
                  accept={INPUTIMAGETYPEACCEPT}
                />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              {hrefCustomerIDBackImage ? (
                <img
                  src={hrefCustomerIDBackImage}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <span>Không có hình</span>
              )}
              {isManualInput && (
                <input
                  {...register("creditcard.customer.id_card_back_image")}
                  type="file"
                  className="form-control"
                  disabled={!isManualInput}
                  accept={INPUTIMAGETYPEACCEPT}
                />
              )}
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
                Số thẻ <FaAsterisk color="red" size=".7em" />
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
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName="creditcard.card_bank_name"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Hạn mức thẻ"
            requiredType="number"
            requiredRegister={register}
            requiredName="creditcard.line_of_credit"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName="fee"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName="creditcard.card_name"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName="creditcard.card_issued_date"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName="creditcard.card_expire_date"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName="creditcard.card_ccv"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày sao kê"
            requiredType="date"
            requiredRegister={register}
            requiredName="creditcard.statement_date"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName="creditcard.maturity_date"
            requiredIsRequired={true}
            optionalDisabled={!isManualInput}
          />
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt trước thẻ tín dụng{" "}
                <FaAsterisk color="red" size=".7em" />
              </label>
              {hrefCreditCardFrontImage ? (
                <img
                  src={hrefCreditCardFrontImage}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <span>Không có hình</span>
              )}
              {isManualInput && (
                <input
                  {...register("creditcard.credit_card_front_image")}
                  type="file"
                  className="form-control"
                  disabled={!isManualInput}
                />
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Ảnh mặt sau thẻ tín dụng <FaAsterisk color="red" size=".7em" />
              </label>
              {hrefCreditCardBackImage ? (
                <img
                  src={hrefCreditCardBackImage}
                  style={{ maxWidth: "100%", height: "auto" }}
                  alt=""
                ></img>
              ) : (
                <span>Không có hình</span>
              )}
              {isManualInput && (
                <input
                  {...register("creditcard.credit_card_back_image")}
                  type="file"
                  className="form-control"
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
                Ngày cuối <FaAsterisk color="red" size=".7em" />
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
        <Pagination
          canBedisabled={rowNotebooks?.results?.length ? false : true}
          currentPage={currentPage}
          totalPages={rowNotebooks.total_pages}
          handleChangePage={handleChangePage}
        />
      </form>
    </div>
  );
}

export default StoreCard;
