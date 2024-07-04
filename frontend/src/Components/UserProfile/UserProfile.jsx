import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import Sidebar from '../SidebarUser/SidebarUser';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:4000/user', {
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
          setUserData(data.user);
          setUserOrders(data.orders);
        } else {
          const text = await response.text();
          throw new Error('Serverul a returnat un format de răspuns neașteptat.');
        }
      } catch (error) {
        console.error('Eroare la preluarea datelor utilizatorului:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        <Sidebar />
        <div className="main-content">
          <h1>CONTUL MEU</h1>
          <div className="account-salute">
            <p>Bună <strong>{userData.name}!</strong></p>
          </div>
          <h2>Detalii cont :</h2>
          <div className="account-details">
            <p><strong>Nume:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
          <h2>Istoric comenzi :</h2>
          {userOrders.length === 0 ? (
            <div className="order-history">
              <span className="order-history-icon">✔️</span>
              <span>Nu există nicio comandă.</span>
            </div>
          ) : (
            <div className="order-list">
              {userOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <h3>Comanda #{order._id}</h3>
                  <p>Data: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Total: {order.total.toFixed(2)} RON</p>
                  <p>Status: {order.status}</p>
                  <h4>Produse:</h4>
                  <ul>
                    {order.cartItems.map((item, idx) => (
                      <li key={idx}>
                        {item.productName} - Cantitate: {item.quantity} - Preț: {item.price.toFixed(2)} RON (cu TVA)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
