import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import InputField from "../Common/inputField";

BillPOSMachineModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredTitle: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  getValues: PropTypes.func.isRequired
};

function BillPOSMachineModal(props) {
  const {
    requiredShow,
    requiredHandleClose,
    requiredTitle,
    requiredRegister,
    index,
    getValues,
  } = props;

  const clickClose = (index) => {
    console.log(
      "🚀 ~ file: billPosmodal.jsx:35 ~ handleClose ~ getValues:",
      getValues(`billpos[${index}].bill_image[0]`)
    );
    requiredHandleClose(index, getValues(`billpos[${index}].bill_image[0]`));
  };

  return (
    <div>
      <Modal size="xl" show={requiredShow} onHide={requiredHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{requiredTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <InputField
              requiredColWidth={4}
              requiredLbl="Số Tiền"
              requiredType="number"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].total_money`}
            />
            <InputField
              requiredColWidth={4}
              requiredLbl="Mã chuẩn chi"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].authorization_code`}
            />
            <InputField
              requiredColWidth={4}
              requiredLbl="Số tham chiếu"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].ref_no`}
            />
          </div>
          <div className="row">
            <InputField
              requiredColWidth={4}
              requiredLbl="Số hoá đơn bill"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].invoice_no`}
            />
            <InputField
              requiredColWidth={4}
              requiredLbl="Số lô"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].batch`}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn variant="secondary" onClick={requiredHandleClose}>
            OK
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BillPOSMachineModal;
