import PropTypes from "prop-types";
import React from "react";
import RequiredSymbol from "./requiredSymbol";

SelectField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,

  requiredLbl: PropTypes.string.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredLblSelect: PropTypes.string.isRequired,

  requiredIsRequired: PropTypes.bool.isRequired,

  requiredDataOption: PropTypes.array.isRequired,

  requiredRegister: PropTypes.func.isRequired,
  requiredValueOption: PropTypes.func.isRequired,
  requiredLblOption: PropTypes.func.isRequired,

  optionalOnChangeSelect: PropTypes.array,
};

SelectField.defaultProps = {
  requiredIsRequired: false,
};

function SelectField(props) {
  const {
    requiredColWidth,
    requiredLbl,
    requiredIsRequired,
    requiredRegister,
    requiredName,
    requiredLblSelect,
    requiredDataOption,
    optionalOnChangeSelect,
    requiredValueOption,
    requiredLblOption,
  } = props;
  return (
    <>
      <div className={`col-md-${requiredColWidth}`}>
        <div className="mb-3">
          <label className="form-label">
            {requiredLbl}
            {requiredIsRequired ? <RequiredSymbol /> : null}
          </label>
          <select
            {...requiredRegister(requiredName)}
            className="form-select"
            required={requiredIsRequired}
            onChange={optionalOnChangeSelect}
          >
            <option value="">{requiredLblSelect}</option>
            {requiredDataOption?.map((ele, index) => (
              <option key={index} value={requiredValueOption(ele)}>
                {requiredLblOption(ele)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectField;
