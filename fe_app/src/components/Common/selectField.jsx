import React from "react";
import PropTypes from "prop-types";
import RequiredSymbol from "./requiredSymbol";

SelectField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredIsRequired: PropTypes.bool.isRequired,
  requiredLblSelect: PropTypes.string.isRequired,
  requiredDataOption: PropTypes.array.isRequired,
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
            {requiredDataOption?.map((ele) => (
              <option
                key={ele.id}
                value={requiredValueOption(ele)}
              >
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
