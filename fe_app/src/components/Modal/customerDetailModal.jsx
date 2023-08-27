import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import DisplayImageFileInputField from "../Common/displayImageFileInputField";
import InputField from "../Common/inputField";
import Spinner from "../Common/spinner";
import { INPUTIMAGETYPEACCEPT } from "../ConstantUtils/constants";

CustomerDetailModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredHandleUpdateCustomerDetail: PropTypes.func.isRequired,
  requiredGetValues: PropTypes.func.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredIsSubmitting: PropTypes.bool.isRequired,
};

function CustomerDetailModal(props) {
  const {
    requiredHandleClose,
    requiredShow,
    requiredIsSubmitting,
    requiredGetValues,
    requiredRegister,
    requiredHandleUpdateCustomerDetail,
  } = props;
  return (
    <>
      <Modal show={requiredShow} onHide={requiredHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thông tin KH</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <InputField
              requiredColWidth={4}
              requiredLbl="Tên KH"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={"name"}
            />
            <InputField
              requiredColWidth={4}
              requiredLbl="Số điện thoại"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={"phone_number"}
              requiredIsRequired={true}
            />
            <InputField
              requiredColWidth={4}
              requiredLbl="Số tài khoản"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredIsRequired={true}
              requiredName={"bank_account.account_number"}
            />
          </div>
          <div className="row">
            <InputField
              requiredColWidth={4}
              requiredLbl="Tên ngân hàng"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredIsRequired={true}
              requiredName={"bank_account.bank_name"}
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
                {requiredGetValues("creditcard")?.map((creditcard, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="/dashboard/creditcardmanagement">
                        {creditcard.card_number}
                      </Link>
                    </td>
                    <td>{creditcard?.bank_account?.card_bank_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn
            variant="secondary"
            onClick={(e) =>
              requiredHandleUpdateCustomerDetail(e, requiredGetValues("id"))
            }
            disabled={requiredIsSubmitting}
          >
            {requiredIsSubmitting && <Spinner />}
            Cập nhập
          </CDBBtn>
          <CDBBtn
            variant="secondary"
            onClick={requiredHandleClose}
            disabled={requiredIsSubmitting}
          >
            {requiredIsSubmitting && <Spinner />}
            Thoát
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomerDetailModal;
