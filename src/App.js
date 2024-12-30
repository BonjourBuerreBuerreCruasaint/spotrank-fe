import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import Signup from './components/Signup/Signup';
import BusinessSignup from './components/BusinessSignup/BusinessSignup';
import FindID from './components/FindID/FindID';
import FindPassWord from './components/FindPassWord/FindPassWord';
import CeoMainPage from './components/CeoMainPage/CeoMainPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
        <Route path="/find-id" element={<FindID />} />
        <Route path="/find-password" element={<FindPassWord />} />
        <Route path="/ceo-main" element={<CeoMainPage />} />
      </Routes>
    </Router>
  );
}

export default App;