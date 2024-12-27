import React from 'react';
<<<<<<< Updated upstream
import MainPage from './components/MainPage/MainPage';

const App = () => {
  return <MainPage />;
};
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';
import Signup from './components/Signup/Signup';
import BusinessSignup from './components/BusinessSignup/BusinessSignup';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
      </Routes>
    </Router>
  );
}
>>>>>>> Stashed changes

export default App;