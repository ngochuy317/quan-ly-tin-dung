import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";
import FileInputField from "../Common/fileInputField";
import InputField from "../Common/inputField";
import SelectField from "../Common/selectField";

BillPOSMachineModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredTitle: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredPosMachine: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  optionalHandleOnChangePOS: PropTypes.func,
};

function BillPOSMachineModal(props) {
  const {
    requiredShow,
    requiredHandleClose,
    requiredTitle,
    requiredRegister,
    requiredPosMachine,
    optionalHandleOnChangePOS,
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
              optionalDefaultValue={0}
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
            <SelectField
              requiredColWidth={2}
              requiredLbl="MáyPOS"
              requiredIsRequired={true}
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].pos`}
              requiredDataOption={requiredPosMachine}
              OptionalOnChangeSelect={optionalHandleOnChangePOS}
              requiredLblSelect="Chọn máy POS"
              requiredValueOption={(ele) => `${ele.id}`}
              requiredLblOption={(ele) =>
                `${ele.id}-${ele.mid}-${ele.tid}-${ele.bank_name}`
              }
            />
          </div>
          <div className="row">
            <FileInputField
              requiredColWidth={4}
              requiredLbl="Hình bill máy POS"
              requiredIsRequired={true}
              requiredRegister={requiredRegister}
              requiredName={`billpos[${index}].bill_image`}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn
            variant="secondary"
            onClick={() => clickClose(index)}
          >
            OK
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BillPOSMachineModal;
