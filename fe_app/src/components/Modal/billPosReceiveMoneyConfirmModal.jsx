import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { BILLPOSRECEIVEMONEY } from "../ConstantUtils/constants";

BillPosReceiveMoneyConfirmModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredDataBillPosReceiveMoneyConfirmModal: PropTypes.object.isRequired,
  requiredHandleConfirm: PropTypes.func.isRequired,
  requiredData: PropTypes.array.isRequired,
  requiredOnChange: PropTypes.func.isRequired,
};

function BillPosReceiveMoneyConfirmModal(props) {
  const {
    requiredShow,
    requiredHandleClose,
    requiredHandleConfirm,
    requiredData,
    requiredOnChange,
    requiredDataBillPosReceiveMoneyConfirmModal,
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
            {requiredDataBillPosReceiveMoneyConfirmModal?.transactionTime}: từ{" "}
            {
              BILLPOSRECEIVEMONEY.find(
                (c) =>
                  c.value ===
                  requiredDataBillPosReceiveMoneyConfirmModal?.receive_money
              )?.label
            }{" "}
            sang{" "}
            <select name="billposstatus" onChange={requiredOnChange} required>
              <option value="">Chọn</option>
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
                requiredDataBillPosReceiveMoneyConfirmModal?.id
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

export default BillPosReceiveMoneyConfirmModal;
