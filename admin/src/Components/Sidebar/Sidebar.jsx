import React from 'react';
import './Sidebar.css';
import { Link, useNavigate } from 'react-router-dom';
import add_product_icon from '../../assets/Product_Cart.png';
import list_product_icon from '../../assets/Product_list_icon.png';
import promo_icon from '../../assets/promo_icon.png';
import statistics_icon from '../../assets/statistics_icon.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }

  return (
    <div className='sidebar'>
        <Link to='addproduct' style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="Add Product" />
                <p>Adaugă produs</p>
            </div>
        </Link>
        <Link to='listproduct' style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="List Product" />
                <p>Listă produs</p>
             </div>
        </Link>
        <Link to='addpromocode' style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={promo_icon} alt="Promo Code" />
                <p>Promocode</p>
             </div>
        </Link>
        <Link to='statistics' style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={statistics_icon} alt="Statistics" />
                <p>Statistici</p>
             </div>
        </Link>
        <Link to='comenzi' style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={statistics_icon} alt="Orders" />
                <p>Comenzi</p>
             </div>
        </Link>
        <div className="sidebar-item logout" onClick={handleLogout}>
            <p>Logout</p>
        </div>
    </div>
  )
}

export default Sidebar;
