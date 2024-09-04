import React, { useState, useEffect } from 'react';
import './UserAddresses.css';
import Sidebar from '../SidebarUser/SidebarUser';

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    country: 'Romania',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    postalCode: '',
    city: '',
    county: '',
    phone: '',
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('https://furnitureshop-backend.onrender.com/addresses', {
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setAddresses(data.addresses);
        } else {
          const text = await response.text();
          throw new Error('Serverul a returnat un format de răspuns neașteptat.');
        }
      } catch (error) {
        console.error('Eroare la preluarea adreselor.:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('https://furnitureshop-backend.onrender.com/addresses', {
        method: 'POST',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address: newAddress })
      });

      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
        setNewAddress({
          country: 'Romania',
          firstName: '',
          lastName: '',
          company: '',
          address: '',
          postalCode: '',
          city: '',
          county: '',
          phone: '',
        });
      } else {
        console.error('Eroare la adăugarea adresei:', data.errors);
      }
    } catch (error) {
      console.error('Eroare la adăugarea adresei:', error);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`https://furnitureshop-backend.onrender.com/addresses/${index}`, {
        method: 'DELETE',
        headers: {
          'auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
      } else {
        console.error('Eroare la ștergerea adresei:', data.errors);
      }
    } catch (error) {
      console.error('Eroare la ștergerea adresei:', error);
    }
  };

  return (
    <div className="user-addresses">
      <div className="user-addresses-container">
        <Sidebar />
        <div className="main-content">
          <h1>ADRESELE MELE</h1>
          <div className="address-list">
            {addresses.map((address, index) => (
              <div key={index} className="address-item">
                <p><strong>{address.firstName} {address.lastName}</strong></p>
                <p>{address.company}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.county}, {address.postalCode}</p>
                <p>{address.country}</p>
                <p>{address.phone}</p>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAddress(index)}
                >
                  Șterge
                </button>
              </div>
            ))}
          </div>
          <h2>Adaugă o adresă nouă</h2>
          <form onSubmit={handleAddAddress} className="address-form">
            <input
              type="text"
              name="firstName"
              placeholder="Prenume"
              value={newAddress.firstName}
              onChange={handleAddressChange}
              required
              className="half-width"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Nume"
              value={newAddress.lastName}
              onChange={handleAddressChange}
              required
              className="half-width"
            />
            <input
              type="text"
              name="company"
              placeholder="Compania (optional)"
              value={newAddress.company}
              onChange={handleAddressChange}
              className="full-width"
            />
            <input
              type="text"
              name="address"
              placeholder="Adresa"
              value={newAddress.address}
              onChange={handleAddressChange}
              required
              className="full-width"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Cod Postal"
              value={newAddress.postalCode}
              onChange={handleAddressChange}
              required
              className="third-width"
            />
            <input
              type="text"
              name="city"
              placeholder="Localitatea"
              value={newAddress.city}
              onChange={handleAddressChange}
              required
              className="third-width"
            />
            <input
              type="text"
              name="county"
              placeholder="Judetul"
              value={newAddress.county}
              onChange={handleAddressChange}
              required
              className="third-width"
            />
            <input
              type="text"
              name="phone"
              placeholder="Telefon"
              value={newAddress.phone}
              onChange={handleAddressChange}
              required
              className="full-width"
            />
            <button type="submit">Adaugă adresă</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAddresses;
