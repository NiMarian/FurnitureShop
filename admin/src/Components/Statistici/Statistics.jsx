import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
    const [bestSellingProduct, setBestSellingProduct] = useState(null);
    const [leastSellingProduct, setLeastSellingProduct] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalSales, setTotalSales] = useState(0);
    const [orders, setOrders] = useState([]);
    const tva = 19;

    useEffect(() => {
        fetch('http://localhost:4000/bestsellingproduct')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setBestSellingProduct(data.bestSellingProduct);
                    setLeastSellingProduct(data.leastSellingProduct);
                } else {
                    console.error('Nu s-a putut prelua lista produselor cu cele mai mari și cele mai mici vânzări.:', data.message);
                }
            })
            .catch(error => console.error('Eroare la preluarea produselor:', error));
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetch(`http://localhost:4000/totalsales?startDate=${startDate}&endDate=${endDate}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setTotalSales(data.totalSales);
                        setOrders(data.orders || []);
                    } else {
                        console.error('Nu s-a putut prelua totalul vânzărilor:', data.message);
                    }
                })
                .catch(error => console.error('Eroare la preluarea totalului vânzărilor:', error));
        }
    }, [startDate, endDate]);

    const calculatePriceWithTva = (price) => {
        return (price * (1 + tva / 100)).toFixed(2);
    };

    const calculateTotalWithTva = (total) => {
        return (total * (1 + tva / 100)).toFixed(2);
    };

    return (
        <div className="statistics">
            <h2>Statistici</h2>
            <div className="product-container">
                {bestSellingProduct ? (
                    <div className="best-selling-product">
                        <h3>Cel mai vândut produs</h3>
                        <p>Nume: {bestSellingProduct.name}</p>
                        <p>Categorie: {bestSellingProduct.category}</p>
                        <p>Preț: {calculatePriceWithTva(bestSellingProduct.new_price)} RON (cu TVA)</p>
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
                        <p>Preț: {calculatePriceWithTva(leastSellingProduct.new_price)} RON (cu TVA)</p>
                        <p>Produse vândute: {leastSellingProduct.soldCount}</p>
                        <img src={leastSellingProduct.image} alt={leastSellingProduct.name} />
                    </div>
                ) : (
                    <p className="no-product">Nu există cel mai puțin vândut produs</p>
                )}
            </div>
            <div className="sales-container">
                <h3>Vânzări totale pe perioadă</h3>
                <div className="date-range">
                    <label>
                        De la:
                        <input
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={handleDateChange}
                        />
                    </label>
                    <label>
                        Până la:
                        <input
                            type="date"
                            name="endDate"
                            value={endDate}
                            onChange={handleDateChange}
                        />
                    </label>
                </div>
                <p>Vânzări totale: {calculateTotalWithTva(totalSales)} RON (cu TVA)</p>
                
                <div className="orders-list">
                    <h3>Comenzi pentru perioada selectată:</h3>
                    {orders.map((order, index) => (
                        <div key={index} className="order-item">
                            <h4>Comandă {index + 1}:</h4>
                            {order.products.map((product, productIndex) => (
                                <div key={productIndex}>
                                    <p>Produs: {product.productName}</p>
                                    <p>Cantitate: {product.quantity}</p>
                                    <p>Preț: {calculatePriceWithTva(product.price)} RON (cu TVA)</p>
                                </div>
                            ))}
                            <p>Reducerea: {order.promoDiscount}</p>
                            <p><strong>Valoarea totală a comenzii: {calculateTotalWithTva(order.total)} RON (cu TVA)</strong></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Statistics;
