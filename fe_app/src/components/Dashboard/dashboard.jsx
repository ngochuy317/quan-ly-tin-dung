import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoutesApp from "../../routes";
import NavBar from "../NavBar/navBar";
import SideBar from "../Sidebar/sideBar";

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
    console.log("Did mount");
  }, []);
  return (
    <>
      <SideBar path={"/dashboard/swipecard"} />
      <div className="col py-3">
        <NavBar />
        <RoutesApp />
      </div>
    </>
  );
}

export default Dashboard;
