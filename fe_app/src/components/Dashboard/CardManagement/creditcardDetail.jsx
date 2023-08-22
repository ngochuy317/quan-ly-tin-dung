import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";
import DisplayImageFileInputField from "../../Common/displayImageFileInputField";
import InputField from "../../Common/inputField";
import Spinner from "../../Common/spinner";
import { INPUTIMAGETYPEACCEPT } from "../../ConstantUtils/constants";

function CreditCardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    async function fetchCreditCardDetail() {
      try {
        const response = await creditCardApi.getDetail(id);
        console.log("Fetch creditcard detail successfully", response);
        reset({ ...response });
      } catch (error) {
        console.log("Failed to fetch creditcard detail", error);
      }
    }
    fetchCreditCardDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      if (data.credit_card_front_image) {
        if (typeof data.credit_card_front_image === "string") {
          delete data.credit_card_front_image;
        } else {
          data.credit_card_front_image = data.credit_card_front_image[0];
        }
      }

      if (data.credit_card_back_image) {
        if (typeof data.credit_card_back_image === "string") {
          delete data.credit_card_back_image;
        } else {
          data.credit_card_back_image = data.credit_card_back_image[0];
        }
      }
      console.log(
        "🚀 ~ file: creditcardDetail.jsx:33 ~ onSubmit ~ data:",
        data
      );
      const response = await creditCardApi.updateOne(id, data);
      console.log("Update creditcard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update creditcard", error);
    }
  };

  return (
    <>
      <h2 className="text-center">Chi Tiết Thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <InputField
            requiredColWidth={4}
            requiredLbl="Ngân hàng phát hành thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"card_bank_name"}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Số thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"card_number"}
            optionalDisabled={true}
          />
          <InputField
            requiredColWidth={4}
            requiredLbl="Tên trên thẻ"
            requiredType="text"
            requiredRegister={register}
            requiredName={"card_name"}
          />
        </div>
        <div className="row">
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày mở thẻ"
            requiredType="date"
            requiredRegister={register}
            requiredName={"card_issued_date"}
          />
          <InputField
            requiredColWidth={3}
            requiredLbl="Ngày hết hạn"
            requiredType="date"
            requiredRegister={register}
            requiredName={"card_expire_date"}
          />
          <InputField
            requiredColWidth={2}
            requiredLbl="CCV"
            requiredType="text"
            requiredRegister={register}
            requiredName={"card_ccv"}
            optionalMaxLengthForTextType={3}
          />
        </div>
        <div className="row">
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt trước thẻ tín dụng"}
            requiredImageUrl={`${getValues("credit_card_front_image")}`}
            requiredRegister={register}
            requiredName={"credit_card_front_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
          <DisplayImageFileInputField
            requiredColWidth={6}
            requiredLbl={"Ảnh mặt sau thẻ tín dụng"}
            requiredImageUrl={`${getValues("credit_card_back_image")}`}
            requiredRegister={register}
            requiredName={"credit_card_back_image"}
            optionalAccept={INPUTIMAGETYPEACCEPT}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            disabled={isSubmitting}
            className="btn btn-outline-danger mx-3"
          >
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-outline-primary"
          >
            {isSubmitting && <Spinner/>}
            Xác nhận
          </button>
        </div>
      </form>
    </>
  );
}

export default CreditCardDetail;
