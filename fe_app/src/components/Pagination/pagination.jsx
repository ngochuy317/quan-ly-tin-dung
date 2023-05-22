import PropTypes from "prop-types";
import React from "react";

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
              <button
                className="btn btn-primary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => {
                  handleChangePageClick(1 - currentPage);
                }}
              >
                &laquo; Trang đầu
              </button>
            </div>
            <div className="btn-group me-1" role="group">
              <button
                disabled={currentPage <= 1}
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(-1);
                }}
              >
                Trang trước
              </button>
            </div>

            <span className="current">
              &nbsp; {currentPage} / {totalPages} &nbsp;
            </span>
            <div className="btn-group me-1" role="group">
              <button
                disabled={currentPage >= totalPages}
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(1);
                }}
              >
                Trang tiếp &nbsp;
              </button>
            </div>
            <div className="btn-group me-1" role="group">
              <button
                disabled={currentPage >= totalPages}
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleChangePageClick(totalPages - currentPage);
                }}
              >
                Trang cuối &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
