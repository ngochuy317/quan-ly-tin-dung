import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import notebookAPI from "../../../api/notebookAPI";
import storeApi from "../../../api/storeAPI";

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
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Cửa hàng</label>
              <select
                {...register("store", { required: true })}
                className="form-control"
                defaultValue={{ label: "Select Dept", value: 0 }}
              >
                {stores &&
                  stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
              </select>
            </div>
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

export default NewNotebook;
