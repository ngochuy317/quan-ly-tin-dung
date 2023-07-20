import React from "react";
import PropTypes from "prop-types";
import RequiredSymbol from "./requiredSymbol";

InputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredType: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredIsRequired: PropTypes.bool.isRequired,
  optionalDefaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

InputField.defaultProps = {
  requiredIsRequired: false,
};

function InputField(props) {
  const {
    requiredColWidth,
    requiredLbl,
    requiredType,
    requiredRegister,
    requiredName,
    requiredIsRequired,
    optionalDefaultValue,
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
          type={requiredType}
          className="form-control"
          required={requiredIsRequired}
          value={optionalDefaultValue}
        />
      </div>
    </div>
  );
}

export default InputField;
