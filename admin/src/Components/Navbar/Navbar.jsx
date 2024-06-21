import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo2.png'
import navProfile from '../../assets/nav-profile.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navlogo} alt="Logo" className="nav-logo" />
        <a href="http://localhost:3000/">
            <img src={navProfile} className="nav-profile" alt="Profile" />
        </a>
    </div>
  )
}

export default Navbar
