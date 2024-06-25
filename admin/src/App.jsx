import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import AdminLogin from './Pages/AdminLogin/AdminLogin';

const App = () => {
  const isAdminAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={isAdminAuthenticated() ? <Admin /> : <Navigate to="/admin/login" />} />
      </Routes>
    </div>
  );
};

export default App;
