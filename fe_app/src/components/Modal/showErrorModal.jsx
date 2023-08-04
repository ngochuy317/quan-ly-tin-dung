import { CDBBtn } from "cdbreact";
import PropTypes from "prop-types";
import React from "react";
import Modal from "react-bootstrap/Modal";

ShowErrorModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  msg: PropTypes.string,
};

function ShowErrorModal(props) {
  const { show, handleClose, msg } = props;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lỗi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{msg}</div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn variant="secondary" onClick={handleClose} circle>
            OK
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowErrorModal;
