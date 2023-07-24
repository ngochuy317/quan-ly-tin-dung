import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import storeMakePOSApi from "../../../api/storeMakePOSAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import SelectField from "../../Common/selectField";
import { POSSTATUS } from "../../ConstantUtils/constants";

function POSesDetail() {
  const [stores, setStores] = useState([]);
  const [storeMakePOS, setStoreMakePOSApi] = useState([]);
  const { register, handleSubmit, reset, setValue, getValues } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPOSDetail() {
      try {
        const response = await posApi.getDetail(id);
        console.log("Fetch pos detail successfully", response);

        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);

        const responseJSONStoreMakePOSApi = await storeMakePOSApi.getAllFull();
        console.log("Fetch store make POS list successfully", responseJSONStoreMakePOSApi);

        setStores(responseJSONStore);
        setStoreMakePOSApi(responseJSONStoreMakePOSApi);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch pos detail", error);
      }
    }

    fetchPOSDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      const response = await posApi.updateOne(id, data);
      console.log("Update pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update pos", error);
    }
  };

  const handleOnChangeMoneyLimitPerDay = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("money_limit_per_day", val);
  };

  const onDelete = async () => {
    try {
      const response = await posApi.deleteOne(id);
      console.log("Delete pos successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete pos", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Máy POS</h2>
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
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("money_limit_per_day")}
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
        </div>
        <div className="row">
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
          <button
            type="button"
            onClick={() => onDelete()}
            className="btn btn-outline-danger mx-3"
          >
            Xoá
          </button>
          <button type="button" className="btn btn-outline-danger mx-3">
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button type="submit" className="btn btn-outline-primary">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
}

export default POSesDetail;
