import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(getTotalCartAmount());

    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    const applyPromoCode = async () => {
        try {
            let response = await fetch('http://localhost:4000/checkpromocode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: promoCode }),
            });
            let data = await response.json();
            if (data.success) {
                setDiscount(data.discount);
                setTotal(getTotalCartAmount() * (1 - data.discount / 100));
                alert("Promo code aplicat");
            } else {
                alert("Promo code invalid");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la aplicarea promo code-ului");
        }
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Produse</p>
                <p>Titlu</p>
                <p>Preț</p>
                <p>Cantitate</p>
                <p>Total</p>
                <p>Șterge</p>
            </div>
            <hr />
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return <div key={e.id}>
                        <div className="cartitems-format cartitems-format-main">
                            <img src={e.image} alt="" className='carticon-product-icon' />
                            <p>{e.name}</p>
                            <p>{e.new_price} RON</p>
                            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                            <p>{e.new_price * cartItems[e.id]} RON</p>
                            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                        </div>
                        <hr />
                    </div>
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Total Cos</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>{getTotalCartAmount()} RON</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Cost de livrare</p>
                            <p>Gratuit</p>
                        </div>
                        <hr />
                        <div className="caritems-total-item">
                            <h3>Total</h3>
                            <h3>{total} RON</h3>
                        </div>
                    </div>
                    <button>Pasul Urmator</button>
                </div>
                <div className="cartitems-promocode">
                    <p>Daca ai un promo code, introdu-l aici</p>
                    <div className="cartitems-promobox">
                        <input type="text" value={promoCode} onChange={handlePromoCodeChange} placeholder='promo code' />
                        <button onClick={applyPromoCode}>Verifica</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItems;
