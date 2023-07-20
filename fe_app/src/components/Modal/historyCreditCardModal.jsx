import { CDBBtn } from "cdbreact";
import React from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

HistoryCreditCardModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  dataTableHistoryCreditCard: PropTypes.array,
};

function HistoryCreditCardModal(props) {
  const { show, handleClose, title, dataTableHistoryCreditCard } = props;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin thẻ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>{title}</div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Cửa hàng</th>
                  <th scope="col">Số tiền</th>
                  <th scope="col">Ngày giờ</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {dataTableHistoryCreditCard?.map((data, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{data.store_name}</td>
                    <td>{data.customer_money_needed}</td>
                    <td>{data.transaction_datetime_created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CDBBtn variant="secondary" onClick={handleClose}>
            OK
          </CDBBtn>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default HistoryCreditCardModal;
