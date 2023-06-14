import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  function handleClickLogOut(e) {
    e.preventDefault();
    localStorage.removeItem("access_token");
    localStorage.removeItem("activeTab");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <div className="navbar-brand"></div>
        <div className="d-flex">
          <span className="mr-auto">
            <div>
              Xin chào{" "}
              <a href="/#" onClick={handleClickLogOut}>
                Đăng xuất
              </a>
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
