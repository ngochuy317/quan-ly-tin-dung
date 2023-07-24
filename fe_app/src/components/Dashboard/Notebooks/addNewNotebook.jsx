import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import notebookAPI from "../../../api/notebookAPI";
import storeApi from "../../../api/storeAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";

function NewNotebook() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListStore() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);
        setStores(responseJSONStore);
      } catch (error) {
        console.log("Failed to fetch notebook detail", error);
      }
    }

    fetchListStore();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      const response = await notebookAPI.createOne(data);
      console.log("Create notebook successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create notebook", error);
    }
  };

  return (
    <div>
      <h2 className="text-center"> Sổ lưu</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
        <InputField
              requiredColWidth={4}
              requiredLbl="Tên"
              requiredType="text"
              requiredRegister={register}
              requiredName={"name"}
              requiredIsRequired={true}
            />
          <InputField
              requiredColWidth={2}
              requiredLbl="Số lượng lưu trữ"
              requiredType="number"
              requiredRegister={register}
              requiredName={"capacity"}
              requiredIsRequired={true}
            />
          <InputField
              requiredColWidth={2}
              requiredLbl="Số thẻ mỗi trang"
              requiredType="number"
              requiredRegister={register}
              requiredName={"capacity_per_page"}
              requiredIsRequired={true}
            />
            <SelectField
            requiredColWidth={4}
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

export default NewNotebook;
