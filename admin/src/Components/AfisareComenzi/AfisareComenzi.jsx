import React, { useEffect, useState } from 'react';
import './AfisareComenzi.css';

const AfisareComenzi = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/allorders');
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
  

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/deleteorder`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId }), 
      });

      const data = await response.json();
      if (data.success) {
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        console.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/cancelorderadmin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId }),
      });
  
      const data = await response.json();
      if (data.success) {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: 'Anulat' } : order
        );
        setOrders(updatedOrders);
      } else {
        console.error('Failed to cancel order');

      }
    } catch (error) {
      console.error('Error cancelling order:', error);

    }
  };
  

  return (
    <div className="orders-container">
      <h2 className="orders-header">Comenzi</h2>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID Comandă</th>
              <th>Nume Client</th>
              <th>Email</th>
              <th>Data</th>
              <th>Produse</th>
              <th>Total</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td data-label="ID Comandă">{order._id}</td>
                <td data-label="Nume Client">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</td>
                <td data-label="Email">{order.contactDetails.email}</td>
                <td data-label="Data">{new Date(order.date).toLocaleDateString()}</td>
                <td data-label="Produse">
                  <ul>
                    {order.cartItems.map((item, idx) => (
                      <li key={idx}>
                        {item.productName} - Cantitate: {item.quantity} - Preț: {item.price} RON
                      </li>
                    ))}
                  </ul>
                </td>
                <td data-label="Total">{order.total} RON</td>
                <td data-label="Status">{order.status}</td>
                <td data-label="Acțiuni">
                  <button onClick={() => handleDeleteOrder(order._id)}>Sterge Comanda</button>
                  <button 
                    onClick={() => handleCancelOrder(order._id)} 
                    disabled={order.status === 'Anulat'}
                  >
                    Anulează Comanda
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AfisareComenzi;
