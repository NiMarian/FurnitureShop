import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, updateCartItemQuantity } = useContext(ShopContext);
  const [total, setTotal] = useState(getTotalCartAmount().toFixed(2));
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Cart Items:', cartItems);
    console.log("CartItems Type:", typeof cartItems);
    console.log("CartItems Content:", cartItems);
    setTotal(getTotalCartAmount().toFixed(2));
  }, [cartItems, getTotalCartAmount]);

  const handleNextStep = () => {
    navigate('/checkout');
  };

  const handleIncrement = (itemId) => {
    updateCartItemQuantity(itemId, cartItems[itemId] + 1);
  };

  const handleDecrement = (itemId) => {
    if (cartItems[itemId] > 1) {
      updateCartItemQuantity(itemId, cartItems[itemId] - 1);
    }
  };

  const handleRemove = (itemId) => {
    updateCartItemQuantity(itemId, 0);
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
      {all_product && all_product.length > 0 ? Object.keys(cartItems).map((itemId) => {
  if (cartItems[itemId] > 0) {
    const product = all_product.find(e => e.id === Number(itemId));
    if (product) {
      const price = product.new_price_with_tva ? product.new_price_with_tva : 0;
      return (
        <div key={product.id}>
          <div className="cartitems-format cartitems-format-main">
            <img src={product.image} alt="" className='carticon-product-icon' />
            <p>{product.name}</p>
            <p>{price.toFixed(2)} RON</p>
            <div className="cartitems-quantity">
              <button onClick={() => handleDecrement(product.id)}>-</button>
              <span>{cartItems[product.id]}</span>
              <button onClick={() => handleIncrement(product.id)}>+</button>
            </div>
            <p>{(price * cartItems[product.id]).toFixed(2)} RON</p>
            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { handleRemove(product.id) }} alt="" />
          </div>
          <hr />
        </div>
      );
    }
  }
  return null;
}) : <p>Nu există produse în coș.</p>}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Total Coș</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>{getTotalCartAmount().toFixed(2)} RON</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Cost de livrare</p>
              <p>Vezi în pasul următor</p>
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
          <p>Dacă ai un cod promoțional, introdu-l în pasul următor</p>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
