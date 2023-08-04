import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import posApi from "../../../api/posAPI";
import storeApi from "../../../api/storeAPI";
import storeMakePOSApi from "../../../api/storeMakePOSAPI";
import InputField from "../../Common/inputField";
import InputTextareaField from "../../Common/inputTextareaField";
import RequiredSymbol from "../../Common/requiredSymbol";
import SelectField from "../../Common/selectField";
import { POSSTATUS } from "../../ConstantUtils/constants";

function POSesDetail() {
  const [stores, setStores] = useState([]);
  const [storeMakePOS, setStoreMakePOSApi] = useState([]);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState,
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fee4creditcard", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  useEffect(() => {
    async function fetchPOSDetail() {
      try {
        const response = await posApi.getDetail(id);
        console.log("Fetch pos detail successfully", response);
        for (const i in response?.fee4creditcard) {
          response.fee4creditcard[i].exist = true;
        }

        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);

        const responseJSONStoreMakePOSApi = await storeMakePOSApi.getAllFull();
        console.log(
          "Fetch store make POS list successfully",
          responseJSONStoreMakePOSApi
        );

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
      console.log("🚀 ~ file: posesDetail.jsx:56 ~ onSubmit ~ data:", data);
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

  const handleOnChangeMoneyLimitPerTime = (e) => {
    let val = e.target.value?.replaceAll(",", "");
    setValue("money_limit_per_time", val);
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
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Giới hạn quẹt tiền mỗi lần</label>
              <RequiredSymbol />
              <CurrencyFormat
                type="text"
                className="form-control"
                value={getValues("money_limit_per_time")}
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
            optionalLblSelect="Chọn trạng thái"
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
        {fields.length > 0 && (
          <>
            <h5>Phí thẻ tín dụng</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Loại</th>
                    <th scope="col">Phí</th>
                    <th scope="col">Xoá?</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          {...register(`fee4creditcard[${index}].type`)}
                          className="form-control"
                          required={true}
                          type="text"
                        />
                      </td>
                      <td>
                        <input
                          {...register(`fee4creditcard[${index}].fee`)}
                          className="form-control"
                          required={true}
                          type="number"
                          step={"0.01"}
                        />
                      </td>
                      <td>
                        {item?.exist === true && (
                          <input
                            className="form-check-input"
                            type="checkbox"
                            {...register(`fee4creditcard[${index}].delete`)}
                          />
                        )}
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
                            {isSubmitting && (
                              <span className="spinner-border spinner-border-sm mr-1"></span>
                            )}
                            Xoá
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="d-flex justify-content-start">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => append({ new: true })}
            className="btn btn-outline-primary "
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Thêm phí
          </button>
        </div>
        <div className="row">
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"store_id"}
            requiredDataOption={stores}
            optionalLblSelect="Chọn cửa hàng"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) => `${ele.name}`}
          />
          <SelectField
            requiredColWidth={6}
            requiredLbl={"Cửa hàng làm ra máy POS"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"from_store_id"}
            requiredDataOption={storeMakePOS}
            optionalLblSelect="Chọn cửa hàng"
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
