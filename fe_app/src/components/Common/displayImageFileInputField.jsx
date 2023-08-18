import PropTypes from "prop-types";
import React from "react";

DisplayImageFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredImageUrl: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,

  optionalIsRequired: PropTypes.bool,
  optionalDisabled: PropTypes.bool,
  optionalOnChangeInputFile: PropTypes.func,
  optionalAccept: PropTypes.string,
  optionalMaxWidth: PropTypes.string,
};

function DisplayImageFileInputField(props) {
  const {
    requiredName,
    requiredColWidth,
    requiredLbl,
    requiredImageUrl,
    requiredRegister,
    optionalIsRequired,
    optionalOnChangeInputFile,
    optionalAccept,
    optionalDisabled,
    optionalMaxWidth,
  } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">{requiredLbl}</label>
        {requiredImageUrl && (
          <img
            src={requiredImageUrl}
            style={{ maxWidth: optionalMaxWidth || "100%", height: "auto" }}
            alt=""
          ></img>
        )}
        <input
          {...requiredRegister(requiredName)}
          type="file"
          className="form-control"
          required={optionalIsRequired}
          onChange={optionalOnChangeInputFile}
          accept={optionalAccept}
          disabled={optionalDisabled}
        />
      </div>
    </div>
  );
}

export default DisplayImageFileInputField;
