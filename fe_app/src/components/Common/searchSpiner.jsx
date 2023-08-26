import React from "react";

SearchSpiner.propTypes = {};

function SearchSpiner(props) {
  return (
    <span
      className="spinner-border text-secondary spinner-border-sm"
      role="status"
      aria-hidden="true"
    ></span>
  );
}

export default SearchSpiner;
