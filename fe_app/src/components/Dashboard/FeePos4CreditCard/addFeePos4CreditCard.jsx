import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import feePOS4CreditCardAPI from "../../../api/feePOS4CreditCardAPI";
import posApi from "../../../api/posAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";

function AddFeePos4CreditCard() {
  const [poses, setPoses] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await feePOS4CreditCardAPI.createOne(data);
      console.log("Create feePOS4CreditCard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to create feePOS4CreditCard", error);
    }
  };

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

  return (
    <div>
      <h2 className="text-center">Thêm Phí cho thẻ tín dụng</h2>
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
            optionalDisable={poses.length < 1}
            requiredLblSelect="Chọn máy POS"
            requiredValueOption={(ele) => `${ele.id}`}
            requiredLblOption={(ele) =>
              `${ele.name}-${ele.bank_name}-${ele.bank_account}`
            }
          />
        </div>
        <div className="d-flex justify-content-end">
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

export default AddFeePos4CreditCard;
