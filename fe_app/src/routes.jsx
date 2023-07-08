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
import SwipeCardAdm from "./components/Dashboard/SwipeCard/swipeCardAdm";
import SwipeCardDetail from "./components/Dashboard/SwipeCard/swipeCardDetail";
import StoreCard from "./components/Dashboard/StoreCard/storeCard";
import UnsaveCard from "./components/Dashboard/StoreCard/unsaveCard";
import SavedCardList from "./components/Dashboard/StoreCard/savedCardList";
import ProductList from "./components/Dashboard/Product/productList";
import NewProduct from "./components/Dashboard/Product/addNewProduct";
import ProductDetail from "./components/Dashboard/Product/productDetail";
import ReportAdmin from "./components/Dashboard/Report/reportAdmin";
import ReportEmployee from "./components/Dashboard/Report/reportEmployee";

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
      <Route path="/swipecard/:id" element={<SwipeCardDetail />} />
      <Route path="/swipecardadm" element={<SwipeCardAdm />} />
      <Route path="/swipecardadm/:id" element={<SwipeCardDetail />} />
      <Route path="/storecard" element={<StoreCard />} />
      <Route path="/unsavedcard" element={<UnsaveCard />} />
      <Route path="/savedcard" element={<SavedCardList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/add" element={<NewProduct />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/reportadm" element={<ReportAdmin />} />
      <Route path="/reportemp" element={<ReportEmployee />} />
    </Routes>
  );
}

export default RoutesApp;
