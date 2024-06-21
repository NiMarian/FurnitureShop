import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.png'
import list_product_icon from '../../assets/Product_list_icon.png'
import promo_icon from '../../assets/promo_icon.png'
import statistics_icon from '../../assets/statistics_icon.png'

const Sidebar = () => {

  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Adaugă produs</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Listă produs</p>
             </div>
        </Link>
        <Link to={'/addpromocode'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={promo_icon} alt="" />
                <p>Promocode</p>
             </div>
        </Link>
        <Link to={'/statistics'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={statistics_icon} alt="" />
                <p>Statistici</p>
             </div>
        </Link>
        <Link to={'/comenzi'} style={{textDecoration:"none"}}>
            <div className="sidebar-item">
                <img src={statistics_icon} alt="" />
                <p>Comenzi</p>
             </div>
        </Link>
    </div>
  )
}

export default Sidebar