import PropTypes from "prop-types";
import React from "react";
import RequiredSymbol from "./requiredSymbol";

InputTextareaField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,

  requiredLbl: PropTypes.string.isRequired,
  requiredType: PropTypes.string.isRequired,
  requiredName: PropTypes.string.isRequired,

  requiredRegister: PropTypes.func.isRequired,

  requiredIsRequired: PropTypes.bool.isRequired,

  optionalPlaceholder: PropTypes.string,

  optionalOnChange: PropTypes.func,

  optionalMaxForNumberType: PropTypes.number,
  optionalMaxLengthForTextType: PropTypes.number,

  optionalDisabled: PropTypes.bool,
  optionalDefaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

InputTextareaField.defaultProps = {
  requiredIsRequired: false,
  optionalDisabled: false,
};

function InputTextareaField(props) {
  const {
    requiredColWidth,
    requiredLbl,
    requiredType,
    requiredRegister,
    requiredName,
    requiredIsRequired,
    optionalDefaultValue,
    optionalDisabled,
    optionalMaxForNumberType,
    optionalMaxLengthForTextType,
    optionalPlaceholder,
    optionalOnChange,
  } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">
          {requiredLbl}
          {requiredIsRequired ? <RequiredSymbol /> : null}
        </label>
        <textarea
          {...requiredRegister(requiredName)}
          type={requiredType}
          className="form-control"
          required={requiredIsRequired}
          value={optionalDefaultValue}
          disabled={optionalDisabled}
          max={optionalMaxForNumberType}
          maxLength={optionalMaxLengthForTextType}
          placeholder={optionalPlaceholder}
          onChange={optionalOnChange}
        />
      </div>
    </div>
  );
}

export default InputTextareaField;
