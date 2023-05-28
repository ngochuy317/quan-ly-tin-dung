import PropTypes from "prop-types";
import React from "react";

Creditcard.propTypes = {
  register: PropTypes.func,
};

function Creditcard(props) {
  const { register } = props;
  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Số thẻ</label>
            <input
              {...register("card_number")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Ngân hàng</label>
            <input
              {...register("card_bank_name")}
              type="text"
              className="form-control"
              disabled
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
              disabled
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
              disabled
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Tên</label>
            <input
              {...register("card_name")}
              type="text"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Ngày mở thẻ</label>
            <input
              {...register("card_issued_date")}
              type="date"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Ngày hết hạn</label>
            <input
              {...register("card_expire_date")}
              type="date"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">CCV</label>
            <input
              {...register("card_ccv")}
              type="text"
              maxLength="3"
              className="form-control"
              disabled
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Ngày sao kê</label>
            <input
              {...register("statement_date")}
              type="date"
              className="form-control"
              disabled
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">Ngày cuối đáo</label>
            <input
              {...register("maturity_date")}
              type="date"
              className="form-control"
              disabled
            />
          </div>
        </div>
        {/* <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">
              Ảnh mặt trước thẻ tín dụng{" "}
              <FontAwesomeIcon
                icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                color="red"
              />
            </label>
            <input
              {...register("creditcard.credit_card_front_image")}
              type="file"
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3">
            <label className="form-label">
              Ảnh mặt sau thẻ tín dụng{" "}
              <FontAwesomeIcon
                icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
                color="red"
              />
            </label>
            <input
              {...register("creditcard.credit_card_back_image")}
              type="file"
              className="form-control"
              required
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Creditcard;
