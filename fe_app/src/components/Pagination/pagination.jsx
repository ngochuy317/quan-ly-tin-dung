import PropTypes from "prop-types";
import React from "react";
import { CDBBtn } from "cdbreact";

Pagination.propTypes = {
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  handleChangePage: PropTypes.func,
};

function Pagination(props) {
  const { totalPages, currentPage, handleChangePage } = props;

  const handleChangePageClick = (direction) => {
    handleChangePage(direction);
  };

  return (
    <div>
      <div className="container p-4">
        <div className="pagination justify-content-center">
          <div className="btn-group">
            <div className="btn-group me-1" role="group">
              <CDBBtn
                color="primary"
                circle
                // className="btn btn-primary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => {
                  handleChangePageClick(1 - currentPage);
                }}
              >
                &laquo;&laquo;
              </CDBBtn>
            </div>
            <div className="btn-group me-1" role="group">
              <CDBBtn
                color="primary"
                circle
                disabled={currentPage <= 1}
                // className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(-1);
                }}
              >
                &laquo;
              </CDBBtn>
            </div>

            <span className="current">
              &nbsp; {currentPage} / {totalPages} &nbsp;
            </span>
            <div className="btn-group me-1" role="group">
              <CDBBtn
                color="primary"
                circle
                disabled={currentPage >= totalPages}
                // className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(1);
                }}
              >
                &raquo;
              </CDBBtn>
            </div>
            <div className="btn-group me-1" role="group">
              <CDBBtn
                color="primary"
                circle
                disabled={currentPage >= totalPages}
                // className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(totalPages - currentPage);
                }}
              >
                &raquo;&raquo;
              </CDBBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
