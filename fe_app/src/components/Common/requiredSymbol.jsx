import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import PropTypes from "prop-types";

RequiredSymbol.propTypes = {};

function RequiredSymbol(props) {
  return (
    <>
      {" "}
      <FontAwesomeIcon
        icon={icon({ name: "asterisk", style: "solid", size: "2xs" })}
        color="red"
      />
    </>
  );
}

export default RequiredSymbol;
