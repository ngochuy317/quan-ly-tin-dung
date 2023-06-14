import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import notebookAPI from "../../../api/notebookAPI";
import storeApi from "../../../api/storeAPI";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        initValues.store = response.store;
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch notebook detail", error);
      }
    }

    fetchNotebookDetail();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              <label className="form-label">
                Cửa hàng{" "}
                <FontAwesomeIcon
                  icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                  color="red"
                />
              </label>
              <select {...register("store")} className="form-select">
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
