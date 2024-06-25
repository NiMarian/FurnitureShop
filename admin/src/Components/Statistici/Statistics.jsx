import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
    const [bestSellingProduct, setBestSellingProduct] = useState(null);
    const [leastSellingProduct, setLeastSellingProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [totalSales, setTotalSales] = useState(0);
    const [orders, setOrders] = useState([]);
    const [tva, setTva] = useState(0);

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
        setSelectedDate(e.target.value);
    };

    const handleTvaChange = (e) => {
        setTva(parseFloat(e.target.value));
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
                        console.error('Nu s-a putut prelua totalul vânzărilor:', data.message);
                    }
                })
                .catch(error => console.error('Eroare la preluarea totalului vânzărilor:', error));
        }
    }, [selectedDate]);

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
            <div className="tva-container">
                <h3>Setare TVA</h3>
                <input
                    type="number"
                    value={tva}
                    onChange={handleTvaChange}
                    placeholder="Introduceți TVA-ul (%)"
                />
            </div>
            <div className="sales-container">
                <h3>Vânzări totale pe zi</h3>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <p>Vânzări totale: {calculateTotalWithTva(totalSales)} RON (cu TVA)</p>
                
                <div className="orders-list">
                    <h3>Comenzi pentru data selectată:</h3>
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
