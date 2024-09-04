import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [isChecked, setIsChecked] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkboxHandler = (e) => {
    setIsChecked(e.target.checked);
  };

  const checkboxAdminHandler = (e) => {
    setIsAdminLogin(e.target.checked);
  };

  const login = async () => {
    console.log("Login reusit", formData);
    try {
      const endpoint = isAdminLogin ? 'https://furnitureshop-backend.onrender.com/admin/login' : 'https://furnitureshop-backend.onrender.com/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('auth-token', data.token);

        if (isAdminLogin) {
          window.location.href = 'http://localhost:5173/admin';
        } else {
          localStorage.setItem('isAdmin', data.isAdmin ? 'true' : 'false');
          window.location.href = 'http://localhost:3000';
        }
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error("Eroare în timpul logării:", error);
      alert("A intervenit o eroare. Te rog să încerci din nou.");
    }
  };

  const signup = async () => {
    if (!isChecked) {
      alert("Trebuie să fii de acord cu termenii de utilizare și politica de confidențialitate pentru a te înregistra.");
      return;
    }
    console.log("Inregistrare reusita", formData);
    let responseData;
    await fetch('https://furnitureshop-backend.onrender.com/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      alert("Înregistrarea a avut loc cu succes! Spor la cumpărături!");
      localStorage.setItem('auth-token', responseData.token);
      window.location.href = 'http://localhost:3000';
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Inregistreaza-te" && <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continuă</button>
        {state === "Inregistreaza-te" ?
          <p className="loginsignup-login">Deja ai cont? <span onClick={() => { setState("Login") }}>Intră în cont</span></p> :
          <p className="loginsignup-login">Nu ai cont ? <span onClick={() => { setState("Inregistreaza-te") }}>Apasă aici!</span></p>}
        {state === "Inregistreaza-te" &&
          <div className="loginsignup-agree">
            <input type="checkbox" onChange={checkboxHandler} />
            <p>Continuând, confirm că sunt de acord cu termenii de utilizare și politica de confidențialitate.</p>
          </div>}
        {state !== "Inregistreaza-te" &&
          <div>
            <input type="checkbox" onChange={checkboxAdminHandler} />
            <label>Login ca admin</label>
          </div>}
      </div>
    </div>
  );
}

export default LoginSignup;
