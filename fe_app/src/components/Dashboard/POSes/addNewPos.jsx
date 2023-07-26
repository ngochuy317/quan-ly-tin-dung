import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import storeMakePOSApi from "../../../api/storeMakePOSAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import { POSSTATUS } from "../../ConstantUtils/constants";

function NewPos() {
  const [stores, setStores] = useState([]);
  const [storeMakePOS, setStoreMakePOSApi] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListStore() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);

        const responseJSONStoreMakePOSApi = await storeMakePOSApi.getAllFull();
        console.log(
          "Fetch store make POS list successfully",
          responseJSONStoreMakePOSApi
        );

        setStores(responseJSONStore);
        setStoreMakePOSApi(responseJSONStoreMakePOSApi);
      } catch (error) {
        console.log("Failed to fetch pos detail", error);
      }
    }

    fetchListStore();
  }, []);

  const handleOnChangeMoneyLimitPerDay = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("money_limit_per_day", val);
  };

  const handleOnChangeMoneyLimitPerTime = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("money_limit_per_time", val);
  };

  const onSubmit = async (data) => {
    try {
      console.log("🚀 ~ file: addNewPos.jsx:29 ~ onSubmit ~ data:", data);
      const response = await posApi.createOne(data);
      console.log("Create pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create pos", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Thêm Máy POS</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="MID"
            requiredType="text"
            requiredRegister={register}
            requiredName="mid"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="TID"
            requiredType="text"
            requiredRegister={register}
            requiredName="tid"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên máy POS"
            requiredType="text"
            requiredRegister={register}
            requiredName="name"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <InputTextareaField
            requiredColWidth={6}
            requiredLbl="Ghi chú"
            requiredType="text"
            requiredRegister={register}
            requiredName="note"
          />
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới hạn quẹt tiền mỗi ngày</label>
              <RequiredSymbol />
              <CurrencyFormat
                type="text"
                className="form-control"
                required
                thousandSeparator={true}
                onChange={handleOnChangeMoneyLimitPerDay}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới hạn quẹt tiền mỗi lần</label>
              <RequiredSymbol />
              <CurrencyFormat
                type="text"
                className="form-control"
                required
                thousandSeparator={true}
                onChange={handleOnChangeMoneyLimitPerTime}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <SelectField
            requiredColWidth={3}
            requiredLbl={"Trạng thái"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"status"}
            requiredDataOption={POSSTATUS}
            requiredLblSelect="Chọn trạng thái"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName="bank_name"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Số tài khoản tiền về"
            requiredType="text"
            requiredRegister={register}
            requiredName="bank_account"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="SĐT đăng ký"
            requiredType="text"
            requiredRegister={register}
            requiredName="phone_number"
            requiredIsRequired={true}
          />
        </div>
        <div className="row">
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"store"}
            requiredDataOption={stores}
            requiredLblSelect="Chọn cửa hàng"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
          />
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng làm ra máy POS"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"from_store"}
            requiredDataOption={storeMakePOS}
            requiredLblSelect="Chọn cửa hàng"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-outline-primary mx-3">
            Lưu
          </button>
          <button type="button" className="btn btn-outline-danger mx-3">
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

export default NewPos;
