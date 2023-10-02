import PropTypes from "prop-types";
import React, { useState } from "react";
import RequiredSymbol from "./requiredSymbol";

FileInputField.propTypes = {
  requiredColWidth: PropTypes.number.isRequired,
  requiredLbl: PropTypes.string.isRequired,
  requiredRegister: PropTypes.func.isRequired,
  requiredName: PropTypes.string.isRequired,
  requiredIsRequired: PropTypes.bool.isRequired,
  optionalOnChangeInputFile: PropTypes.func,
  optionalAccept: PropTypes.string,
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
    optionalAccept,
  } = props;

  const [imageUrls, setimageUrls] = useState("");

  const onFileInputChange = (e) => {
    const fileList = e.target.files;
    if (!fileList.length) {
      return;
    }
    setimageUrls(URL.createObjectURL(fileList[0]));
    optionalOnChangeInputFile?.();
  };

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
          onChange={(e) => onFileInputChange(e)}
          accept={optionalAccept}
        />

        {imageUrls && (
          <img
            className="w-100 h-100 py-3 object-fit-cover"
            src={imageUrls}
            alt=""
          />
        )}
      </div>
    </div>
  );
}

export default FileInputField;
