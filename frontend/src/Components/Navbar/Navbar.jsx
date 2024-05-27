import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo1.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'


const Navbar = () => {

  const [menu, setMenu] = useState("shop");
  const {getTotalCartItems}= useContext(ShopContext);
  const menuRef = useRef();

const dropdown_toggle = (e) =>{
  menuRef.current.classList.toggle('nav-menu-visible');
  e.target.classList.toggle('open');
}


  return (
    <div className='navbar'>
        <div className='nav-logo'>
          <img src={logo} alt='' width="120" height="120"/>
          <p>Exotique</p>
        </div>
        <img className='nav-dropdown' onClick= {dropdown_toggle} src={nav_dropdown} alt="" />
        <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>{setMenu("magazin")}}><Link style={{textDecoration: "none"}} to='/'>Magazin</Link>{menu==="magazin"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("decoratiuni")}}><Link style={{textDecoration: "none"}} to='decoratiuni'>Decoratiuni</Link>{menu==="decoratiuni"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("luminat")}}><Link style={{textDecoration: "none"}} to='luminat'>Luminat</Link>{menu==="luminat"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("mobila")}}><Link style={{textDecoration: "none"}} to='mobila'>Mobila</Link>{menu==="mobila"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
          <Link to='login'><button>Login</button></Link>
          <Link to ='cos'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar;