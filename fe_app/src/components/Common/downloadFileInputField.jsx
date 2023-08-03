import PropTypes from "prop-types";
import React from "react";

DownloadFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredLblHref: PropTypes.string.isRequired,
  requiredHref: PropTypes.string.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredRegister: PropTypes.any.isRequired,

  optionalOnChangeInputFile: PropTypes.func,
  optionalIsRequired: PropTypes.bool,
  optionalAccept: PropTypes.string,
};

function DownloadFileInputField(props) {
  const {
    requiredColWidth,
    requiredLbl,
    requiredLblHref,
    requiredHref,
    requiredName,
    requiredRegister,
    optionalIsRequired,
    optionalAccept,
    optionalOnChangeInputFile,
  } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">
          {requiredLbl}{" "}
          {requiredHref && requiredHref != "null" && (
            <a href={requiredHref} target="_blank">
              {requiredLblHref}
            </a>
          )}
        </label>
        <input
          {...requiredRegister(requiredName)}
          type="file"
          className="form-control"
          required={optionalIsRequired}
          onChange={optionalOnChangeInputFile}
          accept={optionalAccept}
        />
      </div>
    </div>
  );
}

export default DownloadFileInputField;
