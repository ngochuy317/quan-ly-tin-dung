import React, { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import storeApi from "../../../api/storeAPI";
import DownloadFileInputField from "../../Common/downloadFileInputField";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import RequiredSymbol from "../../Common/requiredSymbol";
import { INPUTPDFFILETYPEACCEPT } from "../../ConstantUtils/constants";
import { formatDataFileField } from "../../Utilities/fileField";

function StoreDetail() {
  const { register, handleSubmit, reset, getValues, setValue } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStoreDetail() {
      try {
        const response = await storeApi.getDetail(id);
        console.log("Fetch store detail successfully", response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch stores detail", error);
      }
    }

    fetchStoreDetail();
  }, []); // eslint-disable-line

  const moneyRentInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("rent", val);
  };
  const moneyElectricBillInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("electric_bill", val);
  };
  const moneyWaterBillInputFieldFormat = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("water_bill", val);
  };

  const onSubmit = async (data) => {
    try {
      let newData;
      newData = formatDataFileField(data, ["contract_of_house_renting_file"]);
      console.log(
        "🚀 ~ file: storeDetail.jsx:42 ~ onSubmit ~ newData:",
        newData
      );
      const response = await storeApi.updateOne(id, newData);
      console.log("Update store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update store", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await storeApi.deleteOne(id);
      console.log("Delete store successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete store", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Cửa hàng </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Tên ghi nhớ"
            requiredType="text"
            requiredRegister={register}
            requiredName="name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={6}
            requiredLbl="Địa chỉ"
            requiredType="text"
            requiredRegister={register}
            requiredName="address"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Số điện thoại"
            requiredType="tel"
            requiredRegister={register}
            requiredName="phone_number"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <DownloadFileInputField
            requiredColWidth={3}
            requiredLbl={"Hợp đồng thuê nhà(PDF)"}
            requiredHref={`${getValues("contract_of_house_renting_file")}`}
            requiredLblHref={"Xem"}
            requiredRegister={register}
            requiredName={"contract_of_house_renting_file"}
            optionalAccept={INPUTPDFFILETYPEACCEPT}
          />
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Tiền thuê nhà
                <RequiredSymbol />{" "}
              </label>
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("rent")}
                required
                thousandSeparator={true}
                onChange={moneyRentInputFieldFormat}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Tiền điện
                <RequiredSymbol />{" "}
              </label>
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("electric_bill")}
                required
                thousandSeparator={true}
                onChange={moneyElectricBillInputFieldFormat}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">
                Tiền nước
                <RequiredSymbol />{" "}
              </label>
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("water_bill")}
                required
                thousandSeparator={true}
                onChange={moneyWaterBillInputFieldFormat}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Phụ phí"
            requiredType="number"
            requiredRegister={register}
            requiredName="surcharge"
          />
          <InputTextareaField
            requiredColWidth={6}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            onClick={() => onDelete()}
            className="btn btn-outline-danger mx-3"
          >
            Xoá
          </button>
          <button type="submit" className="btn btn-outline-primary mx-3">
            Lưu
          </button>
          <button type="button" className="btn btn-outline-primary mx-3">
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoreDetail;
