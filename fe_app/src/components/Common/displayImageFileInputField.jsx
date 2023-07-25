import React from "react";
import PropTypes from "prop-types";

DisplayImageFileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredImageUrl: PropTypes.string.isRequired,
};

function DisplayImageFileInputField(props) {
  const { requiredColWidth, requiredLbl, requiredImageUrl } = props;
  return (
    <div className={`col-md-${requiredColWidth}`}>
      <div className="mb-3">
        <label className="form-label">{requiredLbl}</label>
        <img
          src={requiredImageUrl}
          style={{ maxWidth: "100%", height: "auto" }}
          alt=""
        ></img>
      </div>
    </div>
  );
}

export default DisplayImageFileInputField;
