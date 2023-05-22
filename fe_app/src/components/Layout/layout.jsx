import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard";
import LoginForm from "../LogIn/logIn";
import NoMatch from "../NoMatch/noMatch";

function Layout() {
  return (
    <BrowserRouter>
      <div>
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="dashboard/*" element={<Dashboard />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Layout;
