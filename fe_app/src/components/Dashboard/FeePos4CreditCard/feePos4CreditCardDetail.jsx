import React, { useEffect, useState } from "react";
import feePOS4CreditCardAPI from "../../../api/feePOS4CreditCardAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import posApi from "../../../api/posAPI";

function FeePos4CreditCardDetail() {
  const [poses, setPoses] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPOSNickName = async () => {
      try {
        const response = await posApi.getAllNickName();
        console.log("Fetch pos nick name list successfully", response);

        setPoses(response);
      } catch (error) {
        console.log("Failed to fetch pos nick name list", error);
      }
    };

    fetchPOSNickName();
  }, []);

  useEffect(() => {
    async function fetchStoreDetail() {
      try {
        const response = await feePOS4CreditCardAPI.getDetail(id);
        console.log("Fetch feePOS4CreditCard detail successfully", response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch feePOS4CreditCard detail", error);
      }
    }

    fetchStoreDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      const response = await feePOS4CreditCardAPI.updateOne(id, data);
      console.log("Update feePOS4CreditCard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update feePOS4CreditCard", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await feePOS4CreditCardAPI.deleteOne(id);
      console.log("Delete feePOS4CreditCard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to delete feePOS4CreditCard", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Phí cho thẻ tín dụng</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Loại"
            requiredType="text"
            requiredRegister={register}
            requiredName="type"
            requiredIsRequired={true}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Phí"
            requiredType="number"
            requiredRegister={register}
            requiredName="fee"
            requiredIsRequired={true}
            optionalStep="0.01"
          />
          <SelectField
            requiredColWidth={3}
            requiredLbl={"Máy POS"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"pos_machine"}
            requiredDataOption={poses}
            requiredLblSelect="Chọn máy POS"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) =>
              `${ele.name}-${ele.bank_name}-${ele.bank_account}`
            }
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

export default FeePos4CreditCardDetail;
