import React from "react";
import PropTypes from "prop-types";
import RequiredSymbol from "./requiredSymbol";

FileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredIsRequired: PropTypes.bool.isRequired,
  optionalOnChangeInputFile: PropTypes.func,
};

FileInputField.defaultProps = {
  requiredIsRequired: false,
};

function FileInputField(props) {
  const {
    requiredColWidth,
    requiredLbl,
    requiredRegister,
    requiredName,
    requiredIsRequired,
    optionalOnChangeInputFile,
  } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">
          {requiredLbl}
          {requiredIsRequired ? <RequiredSymbol /> : null}
        </label>
        <input
          {...requiredRegister(requiredName)}
          type="file"
          className="form-control"
          required={requiredIsRequired}
          onChange={optionalOnChangeInputFile}
        />
      </div>
    </div>
  );
}

export default FileInputField;
