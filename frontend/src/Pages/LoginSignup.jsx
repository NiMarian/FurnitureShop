import React from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>Inregistrează-te</h1>
        <div className="loginsignup-fields">
          <input type="text" placeholder='Your Name' />
          <input type="email" placeholder='Email Address' />
          <input type="password" placeholder='Password' />
        </div>
        <button>Continuă</button>
        <p className="loginsignup-login">Deja ai un cont? <span>Intra în cont</span></p>
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>Continuând, confirm că sunt de acord cu termenii de utilizare și politica de confidențialitate.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup;