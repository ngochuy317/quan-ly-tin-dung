import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import InputField from "../Common/inputField";

ModifiyBillPOSMachineModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredTitle: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

function ModifiyBillPOSMachineModal(props) {
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
            <InputField
              requiredColWidth={2}
              requiredLbl="Máy POS"
              requiredType="text"
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].pos`}
              optionalDisabled={true}
            />
          </div>
          <div className="row">
            {getValues(`billpos[${index}].bill_image`) && (
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Hình bill máy POS</label>
                  <img
                    src={getValues(`billpos[${index}].bill_image`)}
                    style={{ maxWidth: "100%", height: "auto" }}
                    alt=""
                  ></img>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn variant="secondary" onClick={() => clickClose(index)}>
            OK
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModifiyBillPOSMachineModal;
