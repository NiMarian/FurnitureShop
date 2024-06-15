import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
    const [bestSellingProduct, setBestSellingProduct] = useState(null);
    const [leastSellingProduct, setLeastSellingProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [totalSales, setTotalSales] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/bestsellingproduct')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setBestSellingProduct(data.bestSellingProduct);
                    setLeastSellingProduct(data.leastSellingProduct);
                } else {
                    console.error('Failed to fetch best selling and least selling products:', data.message);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        if (selectedDate) {
            fetch(`http://localhost:4000/totalsales?date=${selectedDate}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setTotalSales(data.totalSales);
                        setOrders(data.orders || []);
                    } else {
                        console.error('Failed to fetch total sales:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching total sales:', error));
        }
    }, [selectedDate]);

    return (
        <div className="statistics">
            <h2>Statistici</h2>
            <div className="product-container">
                {bestSellingProduct ? (
                    <div className="best-selling-product">
                        <h3>Cel mai vândut produs</h3>
                        <p>Nume: {bestSellingProduct.name}</p>
                        <p>Categorie: {bestSellingProduct.category}</p>
                        <p>Preț: {bestSellingProduct.new_price} RON</p>
                        <p>Produse vândute: {bestSellingProduct.soldCount}</p>
                        <img src={bestSellingProduct.image} alt={bestSellingProduct.name} />
                    </div>
                ) : (
                    <p className="no-product">Nu există cel mai vândut produs</p>
                )}
                {leastSellingProduct ? (
                    <div className="least-selling-product">
                        <h3>Cel mai puțin vândut produs</h3>
                        <p>Nume: {leastSellingProduct.name}</p>
                        <p>Categorie: {leastSellingProduct.category}</p>
                        <p>Preț: {leastSellingProduct.new_price} RON</p>
                        <p>Produse vândute: {leastSellingProduct.soldCount}</p>
                        <img src={leastSellingProduct.image} alt={leastSellingProduct.name} />
                    </div>
                ) : (
                    <p className="no-product">Nu există cel mai puțin vândut produs</p>
                )}
            </div>
            <div className="sales-container">
                <h3>Vânzări totale pe zi</h3>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <p>Vânzări totale: {totalSales} RON</p>
                <div className="orders-list">
                    <h3>Comenzi pentru data selectată:</h3>
                    {orders.map((order, index) => (
                        <div key={index} className="order-item">
                            <h4>Comandă {index + 1}:</h4>
                            {order.products.map((product, productIndex) => (
                                <div key={productIndex}>
                                    <p>Produs: {product.productName}</p>
                                    <p>Cantitate: {product.quantity}</p>
                                    <p>Preț: {product.price} RON</p>
                                </div>
                            ))}
                            <p>Reducerea: {order.promoDiscount}</p>
                            <p><strong>Valoarea totală a comenzii: {order.total} RON</strong></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
