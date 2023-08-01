import React from "react";
import PropTypes from "prop-types";

DisplayImageFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredImageUrl: PropTypes.string.isRequired,
  // requiredRegister: PropTypes.func.isRequired,
  // requiredName: PropTypes.string.isRequired,
  // requiredIsRequired: PropTypes.bool.isRequired,
  // optionalOnChangeInputFile: PropTypes.func,
  // optionalAccept: PropTypes.string,
};

function DisplayImageFileInputField(props) {
  const {
    requiredName,
    requiredColWidth,
    requiredLbl,
    requiredImageUrl,
    requiredRegister,
    requiredIsRequired,
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
          required={requiredIsRequired}
          onChange={optionalOnChangeInputFile}
          accept={optionalAccept}
        />
      </div>
    </div>
  );
}

export default DisplayImageFileInputField;
