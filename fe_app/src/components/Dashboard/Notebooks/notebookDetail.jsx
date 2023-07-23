import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import notebookAPI from "../../../api/notebookAPI";
import storeApi from "../../../api/storeAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";

function NotebookDetail() {
  const [stores, setStores] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotebookDetail() {
      try {
        const responseJSONStore = await storeApi.getAllFull();
        console.log("Fetch store list successfully", responseJSONStore);
        setStores(responseJSONStore);

        const response = await notebookAPI.getDetail(id);
        console.log("Fetch notebook detail successfully", response);

        let initValues = {};
        initValues.name = response.name;
        initValues.pages = response.pages;
        initValues.capacity_per_page = response.capacity_per_page;
        initValues.store = response.store;
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch notebook detail", error);
      }
    }

    fetchNotebookDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await notebookAPI.updateOne(id, data);
      console.log("Update notebook successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update notebook", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await notebookAPI.deleteOne(id);
      console.log("Delete notebook successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete notebook", error);
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
            requiredLbl="Số trang"
            requiredType="number"
            requiredRegister={register}
            requiredName={"pages"}
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

export default NotebookDetail;
