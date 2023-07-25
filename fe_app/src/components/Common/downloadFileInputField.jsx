import PropTypes from "prop-types";
import React from "react";

DownloadFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredLblHref: PropTypes.string.isRequired,
  requiredHref: PropTypes.string.isRequired,
};

function DownloadFileInputField(props) {
  const { requiredColWidth, requiredLbl, requiredLblHref, requiredHref } =
    props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">{requiredLbl}</label>
        <div>
          <a href={requiredHref} target="_blank">
            {requiredLblHref}
          </a>
        </div>
      </div>
    </div>
  );
}

export default DownloadFileInputField;
