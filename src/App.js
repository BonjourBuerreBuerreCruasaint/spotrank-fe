import React from 'react';
import MainPage from './components/MainPage/MainPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import FindID from './components/FindID/FindID';
import FindPassWord from './components/FindPassWord/FindPassWord';
import CeoMainPage from './components/CeoMainPage/CeoMainPage2';
import DetailSales from './components/DetailSales/DetailSales';
import './App.css';
import Signup from './components/Signup/Signup';
import BusinessSignup from './components/BusinessSignup/BusinessSignup';
import './App.css';
import DayDetailSales from './components/DayDetailSales/DayDetailSales';    
import WeekDetailSales from './components/WeekDetailSales/WeekDetailSales';
import MonthDetailSales from './components/MonthDetailSales/MonthDetailSales';
import StoreDetail from './components/StoreDetail/StoreDetail';
import ResetPassWord from './components/ResetPassWord/ResetPassWord'; 
import ShopEditPage from './components/ShopEdit/ShopEditPage';
function App() {
  return (
    <Router>
      <Routes>  
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={<MainPage />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/find-password" element={<FindPassWord />} />
        <Route path="/detail-sales" element={<DetailSales />} />
        <Route path="/day-detail-sales" element={<DayDetailSales />} />
        <Route path="/week-detail-sales" element={<WeekDetailSales />} />
        <Route path="/month-detail-sales" element={<MonthDetailSales />} />
        <Route path="/ceo-main" element={<CeoMainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
        <Route path="/store-detail" element={<StoreDetail />} />
        <Route path="/reset-password" element={<ResetPassWord />} />
        <Route path="/shop-edit" element={<ShopEditPage />} />
      </Routes>
    </Router>
  );
}

export default App;