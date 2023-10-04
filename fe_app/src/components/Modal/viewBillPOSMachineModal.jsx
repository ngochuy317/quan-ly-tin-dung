import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";

ViewBillPOSMachineModal.propTypes = {
  requiredShow: PropTypes.bool.isRequired,
  requiredHandleClose: PropTypes.func.isRequired,
  requiredBillPOSData: PropTypes.array.isRequired,
};

function ViewBillPOSMachineModal(props) {
  const { requiredShow, requiredHandleClose, requiredBillPOSData } = props;
  return (
    <div>
      <Modal size="xl" show={requiredShow} onHide={requiredHandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin Bill máy POS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Máy POS</th>
                  <th scope="col">Hình bill máy POS</th>
                  <th scope="col">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {requiredBillPOSData.map((data, index) => (
                  <tr key={data.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={data.bill_image}
                        style={{
                          maxWidth: "50%",
                          height: "auto",
                        }}
                        alt=""
                      ></img>
                    </td>
                    <td>{data.total_money?.toLocaleString("vn") || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ViewBillPOSMachineModal;
