import React, { useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo1.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'


const Navbar = () => {

  const [menu, setMenu] = useState("shop");
  return (
    <div className='navbar'>
        <div className='nav-logo'>
          <img src={logo} alt='' width="120" height="120"/>
          <p>Exotique</p>
        </div>
        <ul className="nav-menu">
        <li onClick={()=>{setMenu("magazin")}}><Link style={{textDecoration: "none"}} to='/'>Magazin</Link>{menu==="magazin"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("decoratiuni")}}><Link style={{textDecoration: "none"}} to='decoratiuni'>Decoratiuni</Link>{menu==="decoratiuni"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("luminat")}}><Link style={{textDecoration: "none"}} to='luminat'>Luminat</Link>{menu==="luminat"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("mese")}}><Link style={{textDecoration: "none"}} to='mese'>Mese</Link>{menu==="mese"?<hr/>:<></>}</li>
          <li onClick={()=>{setMenu("scaune")}}><Link style={{textDecoration: "none"}} to='scaune'>Scaune</Link>{menu==="scaune"?<hr/>:<></>}</li>
        </ul>
        <div className="nav-login-cart">
          <Link to='login'><button>Login</button></Link>
          <Link to ='cos'><img src={cart_icon} alt="" /></Link>
          <div className="nav-cart-count">0</div>
        </div>
    </div>
  )
}

export default Navbar;