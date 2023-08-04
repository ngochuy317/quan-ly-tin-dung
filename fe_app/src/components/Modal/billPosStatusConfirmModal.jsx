import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { BILLPOSSTATUS } from "../ConstantUtils/constants";

BillPosStatusConfirmModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredDataBillPosStatusConfirmModal: PropTypes.object.isRequired,
  requiredHandleConfirm: PropTypes.func.isRequired,
  requiredData: PropTypes.array.isRequired,
  requiredOnChange: PropTypes.func.isRequired,
};

function BillPosStatusConfirmModal(props) {
  const {
    requiredShow,
    requiredHandleClose,
    requiredHandleConfirm,
    requiredData,
    requiredOnChange,
    requiredDataBillPosStatusConfirmModal,
  } = props;

  return (
    <>
      <Modal show={requiredShow} onHide={requiredHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tiền về</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Xác nhận giao dịch vào{" "}
            {requiredDataBillPosStatusConfirmModal?.transactionTime}: từ{" "}
            {
              BILLPOSSTATUS.find(
                (c) => c.value === requiredDataBillPosStatusConfirmModal?.status
              )?.label
            }{" "}
            sang{" "}
            <select name="billposstatus" onChange={requiredOnChange}>
              {requiredData?.map((ele, index) => (
                <option key={index} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn variant="secondary" onClick={requiredHandleClose} circle>
            Thoát
          </CDBBtn>
          <CDBBtn
            variant="secondary"
            onClick={(e) =>
              requiredHandleConfirm(
                e,
                requiredDataBillPosStatusConfirmModal?.id
              )
            }
            circle
          >
            Xác nhận
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BillPosStatusConfirmModal;
