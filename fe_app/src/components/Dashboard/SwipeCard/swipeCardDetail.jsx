import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";
import DisplayImageFileInputField from "../../Common/displayImageFileInputField";
import InputField from "../../Common/inputField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import Spinner from "../../Common/spinner";
import {
  GENDERCHOICES,
  INPUTIMAGETYPEACCEPT,
  TOLLSTATUS,
  TRANSACTIONTYPE,
} from "../../ConstantUtils/constants";
import ModifiyBillPOSMachineModal from "../../Modal/modifyBillPosMachineModal";

function SwipeCardDetail() {
  const { id } = useParams();
  const [dataSwipCardDetail, setDataSwipCardDetail] = useState();
  const [posList, setPOSList] = useState([]);
  const [indexModal, setIndexModal] = useState(0);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "billpos", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const { isSubmitting } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSwipeCardTransactionDetail() {
      try {
        const response = await swipeCardTransactionAPI.getDetail(id);
        console.log("Fetch SwipeCardTransactionDetail successfully", response);
        for (const i in response?.billpos) {
          response.billpos[i].exist = true;
        }
        const storePOSListResponse = await storeApi.getListPOSById(
          response.store_id
        );
        console.log(
          "🚀 ~ file: swipeCardDetail.jsx:57 ~ fetchSwipeCardTransactionDetail ~ storePOSListResponse:",
          storePOSListResponse
        );
        setPOSList(storePOSListResponse);
        setDataSwipCardDetail(response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch SwipeCardTransactionDetail", error);
      }
    }

    fetchSwipeCardTransactionDetail();
  }, []); // eslint-disable-line

  const handleClickPosMachine = (index, e) => {
    setIndexModal(index);
    console.log(
      "🚀 ~ file: swipeCardInput.jsx:79 ~ handleClickPosMachine ~ index:",
      index
    );
    handleShow();
  };

  const onDelete = async (id) => {
    try {
      const response = await swipeCardTransactionAPI.deleteOne(id);
      console.log("Delete swipe card successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete swipe card", error);
    }
  };

  const moneyInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("customer_money_needed", val);
  };

  const handleClose = (index, imageValue) => {
    // setValue(`billpos[${index}].bill_image`, imageValue);
    setShow(false);
  };

  const onSubmit = async (data) => {
    try {
      if (data.creditcard.id_card_front_image) {
        if (typeof data.creditcard.id_card_front_image === "string") {
          delete data.creditcard.id_card_front_image;
        } else {
          data.creditcard.id_card_front_image =
            data.creditcard.id_card_front_image[0];
        }
      }

      if (data.creditcard.id_card_back_image) {
        if (typeof data.creditcard.id_card_back_image === "string") {
          delete data.creditcard.id_card_back_image;
        } else {
          data.creditcard.id_card_back_image =
            data.creditcard.id_card_back_image[0];
        }
      }

      if (data.creditcard.credit_card_back_image) {
        if (typeof data.creditcard.credit_card_back_image === "string") {
          delete data.creditcard.credit_card_back_image;
        } else {
          data.creditcard.credit_card_back_image =
            data.creditcard.credit_card_back_image[0];
        }
      }

      if (data.creditcard.credit_card_front_image) {
        if (typeof data.creditcard.credit_card_front_image === "string") {
          delete data.creditcard.credit_card_front_image;
        } else {
          data.creditcard.credit_card_front_image =
            data.creditcard.credit_card_front_image[0];
        }
      }

      if (data.transaction_with_customer_image) {
        if (typeof data.transaction_with_customer_image === "string") {
          delete data.transaction_with_customer_image;
        } else {
          data.transaction_with_customer_image =
            data.transaction_with_customer_image[0];
        }
      }

      for (const i in data?.billpos) {
        if (data.billpos[i].exist === true) {
          delete data.billpos[i].bill_image;
        } else {
          data.billpos[i].bill_image = data.billpos[i].bill_image[0];
        }
      }

      console.log("🚀 ~ file: swipeCardDetail.jsx:34 ~ onSubmit ~ data:", data);

      const response = await swipeCardTransactionAPI.updateOne(id, data);
      console.log("Update Swipecard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update swipecard", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Tên cửa hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_name"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_address"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="text"
            requiredRegister={register}
            requiredName={"store_phone_number"}
            optionalDisabled={true}
          />
        </div>
        <div className="row"></div>
        <h5>Khách hàng</h5>
        <div className="row">
          <InputField
            requiredColWidth={2}
            requiredLbl="Tên"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.name"}
          />
          <SelectField
            requiredColWidth={1}
            requiredLbl="Giới tính"
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"creditcard.customer.gender"}
            requiredDataOption={GENDERCHOICES}
            optionalLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName={"creditcard.customer.phone_number"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="Số TK nhận tiền"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.bank_account.account_number"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.customer.bank_account.bank_name"}
          />
        </div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng phát hành thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_bank_name"}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Số thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_number"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_name"}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_issued_date"}
          />

          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.card_expire_date"}
          />

          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"creditcard.card_ccv"}
            optionalMaxLengthForTextType={3}
          />
        </div>
        {/* <InputField
            requiredColWidth={2}
            requiredLbl="Ngày cuối đáo"
            requiredType="date"
            requiredRegister={register}
            requiredName={"creditcard.maturity_date"}
          /> */}
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt trước thẻ tín dụng"}
            requiredImageUrl={`${getValues(
              "creditcard.credit_card_front_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.credit_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt sau thẻ tín dụng"}
            requiredImageUrl={`${getValues(
              "creditcard.credit_card_back_image"
            )}`}
            requiredRegister={register}
            requiredName={"creditcard.credit_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
        </div>
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt trước cmnd/cccd"}
            requiredImageUrl={`${getValues("creditcard.id_card_front_image")}`}
            requiredRegister={register}
            requiredName={"creditcard.id_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt sau cmnd/cccd"}
            requiredImageUrl={`${getValues("creditcard.id_card_back_image")}`}
            requiredRegister={register}
            requiredName={"creditcard.id_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
        </div>
        <h5>Chi tiết giao dịch</h5>
        <div className="row">
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Hoạt động"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"transaction_type"}
            requiredDataOption={TRANSACTIONTYPE}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
            optionalDisable={true}
          />
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">
                Số tiền cần
                <RequiredSymbol />
              </label>
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("customer_money_needed")}
                required
                thousandSeparator={true}
                onChange={moneyInputFieldFormat}
              />
            </div>
          </div>
          <InputField
            requiredColWidth={2}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName={"fee"}
          />
          <DisplayImageFileInputField
            requiredColWidth={4}
            requiredLbl={"Hình GD với khách"}
            requiredImageUrl={`${getValues("transaction_with_customer_image")}`}
            requiredRegister={register}
            requiredName={"transaction_with_customer_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <SelectField
            requiredColWidth={2}
            requiredLbl={"Tình trạng thu phí"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"toll_status"}
            requiredDataOption={TOLLSTATUS}
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
        </div>
        <h5>Máy POS</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Máy POS</th>
                <th scope="col">Hình bill máy POS</th>
                <th scope="col">Hợp lệ</th>
                <th scope="col">Số tiền</th>
                <th scope="col">Xem dữ liệu</th>
                <th scope="col">Xoá</th>
              </tr>
            </thead>
            <tbody>
              {fields?.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    {item?.exist !== true ? (
                      <select
                        {...register(`billpos[${index}].pos`)}
                        className="form-select"
                        required={true}
                        disabled={item?.exist === true}
                      >
                        <option value="">Chọn POS</option>
                        {posList?.poses?.map((ele, index) => (
                          <option key={index} value={ele.id}>
                            {ele.name}-{ele.mid}-{ele.tid}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>
                        {getValues(`billpos[${index}].pos.name`)}-
                        {getValues(`billpos[${index}].pos.mid`)}-
                        {getValues(`billpos[${index}].pos.tid`)}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="col-md-3">
                      <div className="mb-3">
                        {item?.exist === true ? (
                          <img
                            src={`${getValues(`billpos[${index}].bill_image`)}`}
                            style={{
                              maxWidth: "50%",
                              height: "auto",
                            }}
                            alt=""
                          ></img>
                        ) : (
                          <input
                            {...register(`billpos[${index}].bill_image`)}
                            type="file"
                            className="form-control"
                            required={true}
                            accept={INPUTIMAGETYPEACCEPT}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      {...register(`billpos[${index}].valid`)}
                      className={"form-check-input"}
                      type="checkbox"
                    />
                  </td>
                  <td>{getValues(`billpos[${index}].total_money`)}</td>
                  <td>
                    <button
                      id={`file-upload-${index}`}
                      disabled={isSubmitting}
                      className="btn btn-outline-primary form-control"
                      onClick={() => handleClickPosMachine(index)}
                      type="button"
                    >
                      POS {index}
                    </button>
                  </td>
                  <td>
                    {item?.exist !== true && (
                      <button
                        disabled={isSubmitting}
                        onClick={() => {
                          remove(index);
                        }}
                        className="btn btn-outline-danger form-control"
                      >
                        {isSubmitting && <Spinner />}
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-start">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => append({})}
              className="btn btn-outline-primary "
            >
              {isSubmitting && <Spinner />}
              Thêm bill pos
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            onClick={() => onDelete(dataSwipCardDetail.id)}
            className="btn btn-outline-danger"
          >
            {isSubmitting && <Spinner />}
            Xoá
          </button>
          <button
            disabled={isSubmitting}
            type="button"
            className="btn btn-outline-danger mx-3"
          >
            {isSubmitting && <Spinner />}
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary"
          >
            {isSubmitting && <Spinner />}
            Lưu
          </button>
        </div>
        <ModifiyBillPOSMachineModal
          requiredShow={show}
          requiredHandleClose={handleClose}
          requiredTitle={"Bill máy POS"}
          requiredRegister={register}
          index={indexModal}
          getValues={getValues}
        ></ModifiyBillPOSMachineModal>
      </form>
    </div>
  );
}

export default SwipeCardDetail;
