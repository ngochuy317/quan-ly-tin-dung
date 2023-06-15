import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Link, useNavigate, useParams } from "react-router-dom";
import swipeCardTransactionAPI from "../../../api/swipeCardTransactionAPI";

function SwipeCardDetail() {
  const { id } = useParams();
  const [dataSwipCardDetail, setDataSwipCardDetail] = useState();
  const { register, handleSubmit, reset, formState } = useForm();
  const { isSubmitting } = formState;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSwipeCardTransactionDetail() {
      try {
        const response = await swipeCardTransactionAPI.getDetail(id);
        console.log("Fetch SwipeCardTransactionDetail successfully", response);

        let initValues = { ...response };
        setDataSwipCardDetail(response);
        reset({ ...initValues });
      } catch (error) {
        console.log("Failed to fetch SwipeCardTransactionDetail", error);
      }
    }

    fetchSwipeCardTransactionDetail();
  }, []); // eslint-disable-line

  const onSubmit = async (data) => {
    try {
      console.log(data);
      delete data.creditcard.credit_card_front_image;
      delete data.creditcard.credit_card_back_image;
      delete data.customer_id_card_front_image;
      delete data.customer_id_card_back_image;
      delete data.pos;

      const response = await swipeCardTransactionAPI.updateOne(id, data);
      console.log("Update Swipecard successfully", response);
      navigate("./..");
    } catch (error) {
      console.log("Failed to update swipecard", error);
    }
  };

  return (
    <div>
      <h2 className="text-center">Quẹt thẻ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Cửa hàng</h5>
        <div className="row">
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Tên cửa hàng</label>
              <input
                {...register("store_name")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                {...register("store_address")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("store_phone_number")}
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>
        <h5>Máy POS</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Id-Mid-Tid-Tên ngân hàng</label>
              <input
                value={
                  dataSwipCardDetail
                    ? `${dataSwipCardDetail.pos.id}-${dataSwipCardDetail.pos.mid}-${dataSwipCardDetail.pos.tid}-${dataSwipCardDetail.pos.bank_name}`
                    : ``
                }
                type="text"
                className="form-control"
                disabled
              />
            </div>
          </div>
        </div>
        <h5>Khách hàng</h5>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register("customer_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-1">
            <div className="mb-3">
              <label className="form-label">Giới tính</label>
              <input
                {...register("customer_gender")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                {...register("phone_number")}
                type="tel"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số tiền cần</label>
              <input
                {...register("customer_money_needed")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Số TK nhận tiền</label>
              <input
                {...register("customer_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("customer_bank_account")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước cmnd/cccd</label>
              <img
                src={`${dataSwipCardDetail?.customer_id_card_front_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau cmnd/cccd</label>
              <img
                src={`${dataSwipCardDetail?.customer_id_card_back_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>
        </div>
        <div className="row"></div>
        <h5>Thông tin thẻ</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Số thẻ</label>
              <input
                {...register("creditcard.card_number")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Ngân hàng</label>
              <input
                {...register("creditcard.card_bank_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Hạn mức thẻ</label>
              <input
                {...register("line_of_credit")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Phí</label>
              <input
                {...register("fee")}
                type="number"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label">Tên</label>
              <input
                {...register("creditcard.card_name")}
                type="text"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày mở thẻ</label>
              <input
                {...register("creditcard.card_issued_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label">Ngày hết hạn</label>
              <input
                {...register("creditcard.card_expire_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">CCV</label>
              <input
                {...register("creditcard.card_ccv")}
                type="text"
                maxLength="3"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày sao kê</label>
              <input
                {...register("creditcard.statement_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="mb-3">
              <label className="form-label">Ngày cuối đáo</label>
              <input
                {...register("creditcard.maturity_date")}
                type="date"
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt trước thẻ tín dụng</label>
              <img
                src={`${dataSwipCardDetail?.creditcard?.credit_card_front_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Ảnh mặt sau thẻ tín dụng</label>
              <img
                src={`${dataSwipCardDetail?.creditcard?.credit_card_back_image}`}
                style={{ maxWidth: "100%", height: "auto" }}
                alt=""
              ></img>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-outline-danger mx-3">
            <Link
              to="./.."
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thoát
            </Link>
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn btn-outline-primary"
          >
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

export default SwipeCardDetail;
