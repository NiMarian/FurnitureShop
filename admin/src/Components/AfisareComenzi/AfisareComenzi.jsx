import React, { useEffect, useState } from 'react';
import './AfisareComenzi.css';

const AfisareComenzi = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderId: '',
    clientName: '',
    email: '',
    date: '',
    product: '',
    total: '',
    status: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://furnitureshop-backend.onrender.com/allorders');
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);
        } else {
          console.error('Eroare la preluarea comenzilor');
        }
      } catch (error) {
        console.error('Eroare la preluarea comenzilor:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filters, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://furnitureshop-backend.onrender.com/updatestatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedOrders = orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      } else {
        console.error(`Nu s-a putut actualiza starea comenzii la ${newStatus}`);
      }
    } catch (error) {
      console.error(`Nu s-a putut actualiza starea comenzii la ${newStatus}:`, error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const order = orders.find(order => order._id === orderId);

    if (order.status === 'Livrat' || order.status === 'Expediat' || order.status === 'În așteptare') {
      console.error('Comanda nu poate fi ștearsă în starea actuală.');
      return;
    }

    try {
      const response = await fetch(`https://furnitureshop-backend.onrender.com/deleteorder`, {
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
        console.error('Anularea comenzii eșuată');
      }
    } catch (error) {
      console.error('Anularea comenzii eșuată:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    updateOrderStatus(orderId, 'Anulat');
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filterOrders = () => {
    let filtered = orders;

    if (filters.orderId) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(filters.orderId.toLowerCase())
      );
    }

    if (filters.clientName) {
      filtered = filtered.filter(order =>
        `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
          .toLowerCase()
          .includes(filters.clientName.toLowerCase())
      );
    }

    if (filters.email) {
      filtered = filtered.filter(order =>
        order.contactDetails.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(order =>
        new Date(order.date).toISOString().split('T')[0] === filters.date
      );
    }

    if (filters.product) {
      filtered = filtered.filter(order =>
        order.cartItems.some(item =>
          item.productName.toLowerCase().includes(filters.product.toLowerCase())
        )
      );
    }

    if (filters.total) {
      filtered = filtered.filter(order => order.total.toString().includes(filters.total));
    }

    if (filters.status) {
      filtered = filtered.filter(order => order.status.toLowerCase().includes(filters.status.toLowerCase()));
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="orders-container">
      <h2 className="orders-header">Comenzi</h2>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>
                ID Comandă
                <input
                  type="text"
                  name="orderId"
                  placeholder="ID Comandă"
                  value={filters.orderId}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Nume Client
                <input
                  type="text"
                  name="clientName"
                  placeholder="Nume Client"
                  value={filters.clientName}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={filters.email}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Data
                <input
                  type="date"
                  name="date"
                  placeholder="Data"
                  value={filters.date}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Produse
                <input
                  type="text"
                  name="product"
                  placeholder="Produse"
                  value={filters.product}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Total
                <input
                  type="text"
                  name="total"
                  placeholder="Total"
                  value={filters.total}
                  onChange={handleFilterChange}
                />
              </th>
              <th>
                Status
                <input
                  type="text"
                  name="status"
                  placeholder="Status"
                  value={filters.status}
                  onChange={handleFilterChange}
                />
              </th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
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
                <td data-label="Total">{order.total.toFixed(2)} RON</td>
                <td data-label="Status">{order.status}</td>
                <td data-label="Acțiuni">
                  <button onClick={() => handleDeleteOrder(order._id)} disabled={order.status === 'Livrat' || order.status === 'Expediat' || order.status === 'În așteptare'}>
                    Șterge Comanda
                  </button>
                  <button 
                    onClick={() => handleCancelOrder(order._id)} 
                    disabled={order.status === 'Anulat'}
                  >
                    Anulează Comanda
                  </button>
                  {order.status !== 'Anulat' && (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'Expediat')} 
                        disabled={order.status !== 'În procesare'}
                      >
                        Expediat
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'Livrat')} 
                        disabled={order.status !== 'Expediat'}
                      >
                        Livrat
                      </button>
                    </>
                  )}
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
