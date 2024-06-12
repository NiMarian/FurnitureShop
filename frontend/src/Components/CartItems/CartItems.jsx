import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const [total, setTotal] = useState(getTotalCartAmount());
    const navigate = useNavigate();

    useEffect(() => {
        setTotal(getTotalCartAmount());
    }, [cartItems, getTotalCartAmount]);

    const handleNextStep = () => {
        navigate('/checkout');
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
            {all_product && all_product.length > 0 ? all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    const price = e.new_price ? e.new_price : 0;
                    return (
                        <div key={e.id}>
                            <div className="cartitems-format cartitems-format-main">
                                <img src={e.image} alt="" className='carticon-product-icon' />
                                <p>{e.name}</p>
                                <p>{price} RON</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>{price * cartItems[e.id]} RON</p>
                                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            }) : <p>Nu există produse în coș.</p>}

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
                            <p>Vezi in pasul următor</p>
                        </div>
                        <hr />
                        
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>{total} RON</h3>
                        </div>
                    </div>
                    <button onClick={handleNextStep}>Pasul Următor</button>
                </div>
                <div className="cartitems-promocode">
                    <p>Daca ai un cod promoțional, introdu-l in pasul următor</p>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
