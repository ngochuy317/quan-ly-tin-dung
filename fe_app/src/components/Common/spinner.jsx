import React from "react";
import { CDBSpinner, CDBContainer } from "cdbreact";

function Spinner() {
  return (
    <div>
      <CDBContainer>
        <CDBSpinner className="text-center" dark />
      </CDBContainer>
    </div>
  );
}

export default Spinner;
