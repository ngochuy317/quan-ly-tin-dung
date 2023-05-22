import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeDetail from "./components/Dashboard/Employees/employeeDetail";
import EmployeesList from "./components/Dashboard/Employees/employeesList";
import NewEmployee from "./components/Dashboard/Employees/addNewEmployee";
import POSesList from "./components/Dashboard/POSes/posesList";
import POSesDetail from "./components/Dashboard/POSes/posesDetail";
import NewPos from "./components/Dashboard/POSes/addNewPos";
import StoresList from "./components/Dashboard/Stores/storesList";
import StoreDetail from "./components/Dashboard/Stores/storeDetail";
import NewStore from "./components/Dashboard/Stores/addNewStore";
import NotebooksList from "./components/Dashboard/Notebooks/notebooksList";
import NotebookDetail from "./components/Dashboard/Notebooks/notebookDetail";
import NewNotebook from "./components/Dashboard/Notebooks/addNewNotebook";
import SwipeCard from "./components/Dashboard/SwipeCard/swipeCard";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/stores" element={<StoresList />} />
      <Route path="/stores/add" element={<NewStore />} />
      <Route path="/stores/:id" element={<StoreDetail />} />
      <Route path="/notebooks" element={<NotebooksList />} />
      <Route path="/notebooks/add" element={<NewNotebook />} />
      <Route path="/notebooks/:id" element={<NotebookDetail />} />
      <Route path="/poses" element={<POSesList />} />
      <Route path="/poses/add" element={<NewPos />} />
      <Route path="/poses/:id" element={<POSesDetail />} />
      <Route path="/employees" element={<EmployeesList />} />
      <Route path="/employees/add" element={<NewEmployee />} />
      <Route path="/employees/:id" element={<EmployeeDetail />} />
      <Route path="/swipecard" element={<SwipeCard />} />
    </Routes>
  );
}

export default RoutesApp;
