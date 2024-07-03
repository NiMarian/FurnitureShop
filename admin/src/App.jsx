import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';

const App = () => {
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/admin/*" element= {<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
