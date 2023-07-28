import React from "react";
import { Route, Routes } from "react-router-dom";
import BillPOSMachineMangement from "./components/Dashboard/BillPos/billPOSMachineManagement";
import CardManagement from "./components/Dashboard/CardManagement/cardManagement";
import NewEmployee from "./components/Dashboard/Employees/addNewEmployee";
import EmployeeDetail from "./components/Dashboard/Employees/employeeDetail";
import EmployeesList from "./components/Dashboard/Employees/employeesList";
import FeePos4CreditCardDetail from "./components/Dashboard/FeePos4CreditCard/feePos4CreditCardDetail";
import FeePos4CreditCardList from "./components/Dashboard/FeePos4CreditCard/feePos4CreditCardList";
import NewNotebook from "./components/Dashboard/Notebooks/addNewNotebook";
import NotebookDetail from "./components/Dashboard/Notebooks/notebookDetail";
import NotebooksList from "./components/Dashboard/Notebooks/notebooksList";
import NewPos from "./components/Dashboard/POSes/addNewPos";
import POSesDetail from "./components/Dashboard/POSes/posesDetail";
import POSesList from "./components/Dashboard/POSes/posesList";
import NewProduct from "./components/Dashboard/Product/addNewProduct";
import ProductDetail from "./components/Dashboard/Product/productDetail";
import ProductList from "./components/Dashboard/Product/productList";
import ReportAdmin from "./components/Dashboard/Report/reportAdmin";
import ReportEmployee from "./components/Dashboard/Report/reportEmployee";
import SavedCardList from "./components/Dashboard/StoreCard/savedCardList";
import StoreCard from "./components/Dashboard/StoreCard/storeCard";
import UnsaveCard from "./components/Dashboard/StoreCard/unsaveCard";
import NewStore from "./components/Dashboard/Stores/addNewStore";
import NewStoresMakePOS from "./components/Dashboard/Stores/addNewStoresMakePOS";
import StoreDetail from "./components/Dashboard/Stores/storeDetail";
import StoreMakePOSDetail from "./components/Dashboard/Stores/storeMakePOSDetail";
import StoresList from "./components/Dashboard/Stores/storesList";
import StoresMakePOSList from "./components/Dashboard/Stores/storesMakePOSList";
import SwipeCard from "./components/Dashboard/SwipeCard/swipeCard";
import SwipeCardDetail from "./components/Dashboard/SwipeCard/swipeCardDetail";
import SwipeCardMoreDetail from "./components/Dashboard/SwipeCard/swipeCardMoreDetail";
import AddFeePos4CreditCard from "./components/Dashboard/FeePos4CreditCard/addFeePos4CreditCard";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/stores" element={<StoresList />} />
      <Route path="/storesmakepos" element={<StoresMakePOSList />} />
      <Route path="/storesmakepos/add" element={<NewStoresMakePOS />} />
      <Route path="/storesmakepos/:id" element={<StoreMakePOSDetail />} />
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
      <Route path="/swipecarddetail" element={<SwipeCardMoreDetail />} />
      <Route path="/swipecard/:id" element={<SwipeCardDetail />} />
      <Route path="/storecard" element={<StoreCard />} />
      <Route path="/unsavedcard" element={<UnsaveCard />} />
      <Route path="/savedcard" element={<SavedCardList />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/add" element={<NewProduct />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/reportadm" element={<ReportAdmin />} />
      <Route path="/reportemp" element={<ReportEmployee />} />
      <Route path="/creditcarmanage" element={<CardManagement />} />
      <Route path="/billposmanage" element={<BillPOSMachineMangement />} />
      <Route path="/feepos4creditcard" element={<FeePos4CreditCardList />} />
      <Route path="/feepos4creditcard/add" element={<AddFeePos4CreditCard />} />
      <Route path="/feepos4creditcard/:id" element={<FeePos4CreditCardDetail />} />
    </Routes>
  );
}

export default RoutesApp;
