import React from "react";
import { CDBSpinner, CDBContainer } from "cdbreact";

function Spinner() {
  return (
    <>
      <CDBContainer>
        <CDBSpinner className="text-center" dark />
      </CDBContainer>
    </>
  );
}

export default Spinner;
