import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import { POSSTATUS } from "../../ConstantUtils/constants";

function NewPos() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListStore() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);
        setStores(responseJSONStore);
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
            requiredLbl="Merchant ID(MID)"
            requiredType="text"
            requiredRegister={register}
            requiredName="mid"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Terminal ID(TID)"
            requiredType="text"
            requiredRegister={register}
            requiredName="tid"
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
              <RequiredSymbol/>
              <CurrencyFormat
                type="text"
                className="form-control"
                required
                thousandSeparator={true}
                onChange={handleOnChangeMoneyLimitPerDay}
              />
            </div>
          </div>
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
        </div>
        <div className="row">
          <InputField
            requiredColWidth={6}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName="bank_name"
            requiredIsRequired={true}
          />
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
          <div className="row">
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng làm ra máy POS"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"from_store"}
            requiredDataOption={stores}
            requiredLblSelect="Chọn cửa hàng"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
          />
          </div>
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
