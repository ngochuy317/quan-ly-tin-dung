import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function RequiredSymbol() {
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
