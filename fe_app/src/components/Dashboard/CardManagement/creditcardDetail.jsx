import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import creditCardApi from "../../../api/creditCardAPI";

function CreditCardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creaditCard, setCreaditCard] = useState({});
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm();
  const { isSubmitting } = formState;

  useEffect(() => {
    async function fetchCreditCardDetail() {
      try {
        const response = await creditCardApi.getDetail(id);
        console.log("Fetch creditcard detail successfully", response);
        setCreaditCard({ ...response });
      } catch (error) {
        console.log("Failed to fetch creditcard detail", error);
      }
    }
    fetchCreditCardDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
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
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Xác nhận
          </button>
        </div>
      </form>
    </>
  );
}

export default CreditCardDetail;
