import React, { useState, useEffect } from 'react';
import './AddPromoCode.css';

const AddPromoCode = () => {
    const [promoCode, setPromoCode] = useState({
        code: "",
        discount: ""
    });

    const [deleteCode, setDeleteCode] = useState("");
    const [promoCodes, setPromoCodes] = useState([]);

    const changeHandler = (e) => {
        setPromoCode({ ...promoCode, [e.target.name]: e.target.value });
    };

    const changeDeleteHandler = (e) => {
        setDeleteCode(e.target.value);
    };

    const addPromoCode = async () => {
        try {
            let response = await fetch('http://localhost:4000/addpromocode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promoCode),
            });
            let data = await response.json();
            if (data.success) {
                alert("Promo code adăugat");
                fetchPromoCodes();
            } else {
                alert("Eșuat");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la adăugarea promo code-ului");
        }
    };

    const deletePromoCode = async () => {
        try {
            let response = await fetch('http://localhost:4000/removepromocode', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: deleteCode }),
            });
            let data = await response.json();
            if (data.success) {
                alert("Promo code șters");
                fetchPromoCodes();
            } else {
                alert("Eșuat");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la ștergerea promo code-ului");
        }
    };

    const fetchPromoCodes = async () => {
        try {
            let response = await fetch('http://localhost:4000/getpromocodes');
            let data = await response.json();
            if (data.success) {
                setPromoCodes(data.promoCodes);
            } else {
                console.error("Eșuat la preluarea promo code-urilor");
            }
        } catch (error) {
            console.error("Eroare la preluarea promo code-urilor:", error);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    return (
        <div className='add-promocode'>
            <div className="promocode-itemfield">
                <p>Cod Promoțional</p>
                <input value={promoCode.code} onChange={changeHandler} type="text" name='code' placeholder='Scrie aici' />
            </div>
            <div className="promocode-itemfield">
                <p>Discount (%)</p>
                <input value={promoCode.discount} onChange={changeHandler} type="number" name='discount' placeholder='Scrie aici' />
            </div>
            <button onClick={addPromoCode} className='promocode-btn'>Adaugă</button>

            <div className="promocode-itemfield">
                <p>Șterge Cod Promoțional</p>
                <input value={deleteCode} onChange={changeDeleteHandler} type="text" name='deleteCode' placeholder='Scrie codul de șters' />
            </div>
            <button onClick={deletePromoCode} className='promocode-btn'>Șterge</button>

            <div className="promocode-list">
                <h3>Coduri Promoționale</h3>
                <ul>
                    {promoCodes.map((promo, index) => (
                        <li key={index}>
                            Cod: {promo.code} - Discount: {promo.discount}%
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddPromoCode;
