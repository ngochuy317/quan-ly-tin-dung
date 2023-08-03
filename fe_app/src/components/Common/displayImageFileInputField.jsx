import PropTypes from "prop-types";
import React from "react";

DisplayImageFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredImageUrl: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,

  optionalIsRequired: PropTypes.bool,
  optionalOnChangeInputFile: PropTypes.func,
  optionalAccept: PropTypes.string,
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
  } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">{requiredLbl}</label>
        {requiredImageUrl && (
          <img
            src={requiredImageUrl}
            style={{ maxWidth: "100%", height: "auto" }}
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
        />
      </div>
    </div>
  );
}

export default DisplayImageFileInputField;
