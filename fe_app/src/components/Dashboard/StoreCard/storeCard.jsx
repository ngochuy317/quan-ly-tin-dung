import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import unsaveCreditcardApi from "../../../api/unsaveCreditCard";
import userApi from "../../../api/userAPI";
import Creditcard from "../../CreditCard/creditcard";
import creditCardApi from "../../../api/creditCardAPI";

function StoreCard() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const [notebooks, setNotebooks] = useState([]);
  const [creditcards, setCreditcards] = useState([]);
  const [rowNotebooks, setRowNotebooks] = useState([]);

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
          setRowNotebooks(response.store.notebooks[0].row_notebook);
        }
      } catch (error) {
        console.log("Failed to information detail", error);
      }
    }

    fetchEmployeeDetail();
  }, []);

  useEffect(() => {
    async function fetchUnsaveCreditcardByStore() {
      try {
        const response =
          await unsaveCreditcardApi.getAllUnsaveCreditcardByStore();
        console.log("Fetch unsave creditcard by store successfully", response);
        setCreditcards(response);
      } catch (error) {
        console.log("Failed to fetch unsave creditcard by store", error);
      }
    }

    fetchUnsaveCreditcardByStore();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await creditCardApi.saveCreditCard2Notebook(data);
      console.log("Save creditcard 2 notebook successfully", response);
    } catch (error) {
      console.log("Failed to save creditcard 2 notebook");
    }
  };

  const handleOnChangeNotebook = (e) => {
    let val = parseInt(e.target.value);
    let notebook = notebooks.find((c) => c.id === val);
    setRowNotebooks([...notebook.row_notebook]);
    console.log("notebook.row_notebook", notebook.row_notebook);
  };

  const handleOnChangeCreditCard = (e) => {
    let val = parseInt(e.target.value);
    let creditcard = creditcards.find((c) => c.id === val);
    reset({ ...creditcard });
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
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Sổ lưu thẻ</label>
              <select
                {...register("notebook")}
                className="form-select"
                disabled={notebooks.length > 0 ? null : true}
                onChange={handleOnChangeNotebook}
              >
                {notebooks &&
                  notebooks.map((notebook) => (
                    <option key={notebook.id} value={notebook.id}>
                      {notebook.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
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
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Số dư cuối kì</label>
              <input
                {...register("closing_balance")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
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
        </div>
        <Creditcard register={register}></Creditcard>
        <div className="d-flex justify-content-end">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary"
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
                <th scope="col">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {rowNotebooks &&
                rowNotebooks.map((rowNotebook, index) => (
                  <tr key={rowNotebook.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{rowNotebook.status}</td>
                    <td>{rowNotebook.storage_datetime}</td>
                    <td>{rowNotebook.closing_balance}</td>
                    <td>{rowNotebook.note}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* <Pagination
        currentPage={currentPage}
        totalPages={responseData.total_pages}
        handleChangePage={handleChangePage}
      /> */}
      </form>
    </div>
  );
}

export default StoreCard;
