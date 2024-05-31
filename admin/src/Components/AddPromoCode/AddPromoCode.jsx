import React, { useState } from 'react';
import './AddPromoCode.css';


const AddPromoCode = () => {
    const [promoCode, setPromoCode] = useState({
        code: "",
        discount: ""
    });

    const changeHandler = (e) => {
        setPromoCode({ ...promoCode, [e.target.name]: e.target.value });
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
            data.success ? alert("Promo code adăugat") : alert("Eșuat");
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la adăugarea promo code-ului");
        }
    };

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
        </div>
    );
};

export default AddPromoCode;
