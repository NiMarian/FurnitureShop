import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SidebarUser.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        ☰ Meniu
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className='sidebar-item'>CONTUL MEU</div>
        <div
          className={`sidebar-item2 ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => {
            navigate('/profile');
            setIsOpen(false); 
          }}
        >
          DETALII CONT
        </div>
        <div
          className={`sidebar-item2 ${location.pathname === '/profile/addresses' ? 'active' : ''}`}
          onClick={() => {
            navigate('/profile/addresses');
            setIsOpen(false);
          }}
        >
          ADRESE
        </div>
      </div>
    </>
  );
};

export default Sidebar;
