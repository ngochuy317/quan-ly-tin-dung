import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutesApp from "../../routes";
import NavBar from "../NavBar/navBar";
import SideBarNew from "../Sidebar/sideBarNew";
import SideBar from "../Sidebar/sideBar";

export const AuthContext = createContext();

function Dashboard() {
  const [decodedToken, setDecodedToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getDecodedToken = () => {
      try {
        let access_token = jwtDecode(localStorage.getItem("access_token"));
        setDecodedToken(access_token);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    };

    getDecodedToken();
  }, []); // eslint-disable-line
  return (
    <AuthContext.Provider value={{ ...decodedToken }}>
      <SideBarNew path={"/dashboard/swipecard"} />
      <div className="col py-3">
        <NavBar />
        <RoutesApp />
      </div>
    </AuthContext.Provider>
  );
}

export default Dashboard;
