import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import customerApi from "../../../api/customerAPI";
import InputField from "../../Common/inputField";
import SelectField from "../../Common/selectField";
import Spinner from "../../Common/spinner";
import { GENDERCHOICES } from "../../ConstantUtils/constants";

CustomerDetail.propTypes = {};

function CustomerDetail() {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { isSubmitting } = formState;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustomerDetail() {
      try {
        const response = await customerApi.getDetail(id);

        console.log("Fetch customer detail successfully", response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch customer detail", error);
      }
    }

    fetchCustomerDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      const response = await customerApi.updateOne(id, data);
      console.log("Update customer successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to customer pos", error);
    }
  };

  //   const onDelete = async () => {
  //     try {
  //       const response = await customerApi.deleteOne(id);
  //       console.log("Delete customer successfully", response);
  //       navigate("./..");
  //     } catch (error) {
  //       console.log("Failed to delete customer", error);
  //     }
  //   };

  return (
    <>
      <h2 className="text-center">Chi tiết khách hàng</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên KH"
            requiredType="text"
            requiredRegister={register}
            requiredName={"name"}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Số điện thoại"
            requiredType="text"
            requiredRegister={register}
            requiredName={"phone_number"}
            optionalMaxLengthForTextType={12}
            requiredIsRequired={true}
          />
          <SelectField
            requiredColWidth={4}
            requiredLbl={"Giới tính"}
            requiredIsRequired={true}
            requiredRegister={register}
            requiredName={"gender"}
            requiredDataOption={GENDERCHOICES}
            optionalLblSelect="Chọn giới tính"
            requiredValueOption={(ele) => `${ele.value}`}
            requiredLblOption={(ele) => `${ele.label}`}
          />
        </div>
        <div className="row">
        <InputField
            requiredColWidth={4}
            requiredLbl="Số tài khoản ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"bank_account.account_number"}
            requiredIsRequired={true}
          />
        <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng"
            requiredType="text"
            requiredRegister={register}
            requiredName={"bank_account.bank_name"}
            requiredIsRequired={true}
          />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Số thẻ</th>
                <th scope="col">Ngân hàng</th>
              </tr>
            </thead>
            <tbody>
              {getValues("creditcard")?.map((creditcard, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to="/dashboard/creditcardmanagement">
                      {creditcard.card_number}
                    </Link>
                  </td>
                  <td>{creditcard?.card_bank_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-outline-primary mx-3"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              Lưu
            </button>
            <button
              type="button"
              className="btn btn-outline-primary mx-3"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              <Link
                to="./.."
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Thoát
              </Link>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default CustomerDetail;
