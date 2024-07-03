import React, { useContext, useRef, useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo1.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';
import nav_profile from '../Assets/nav-profile.png';

const Navbar = () => {
  const [menu, setMenu] = useState(localStorage.getItem('selectedMenu') || 'shop');
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedMenu', menu);
  }, [menu]);

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={logo}/>
        <p>Exotique</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => { setMenu("magazin") }}>
          <Link style={{ textDecoration: "none" }} to='/'>Magazin</Link>
          {menu === "magazin" && <hr />}
        </li>
        <li onClick={() => { setMenu("decoratiuni") }}>
          <Link style={{ textDecoration: "none" }} to='decoratiuni'>Decorațiuni</Link>
          {menu === "decoratiuni" && <hr />}
        </li>
        <li onClick={() => { setMenu("luminat") }}>
          <Link style={{ textDecoration: "none" }} to='luminat'>Luminat</Link>
          {menu === "luminat" && <hr />}
        </li>
        <li onClick={() => { setMenu("mobila") }}>
          <Link style={{ textDecoration: "none" }} to='mobila'>Mobilă</Link>
          {menu === "mobila" && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        <Link to='cos'><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
        {isAuthenticated ? 
          <button onClick={handleLogout}>Logout</button>
          : <Link to='login'><button>Login</button></Link>}
        {isAuthenticated && (
          <img className="nav-profile-icon" src={nav_profile} onClick={handleProfileClick}/>
        )}
      </div>
    </div>
  );
}

export default Navbar;
