import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'

const CartItems = () => {
    const {getTotalCartAmount,all_product, cartItems,removeFromCart} = useContext(ShopContext);
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Produse</p>
            <p>Titlu</p>
            <p>Pret</p>
            <p>Cantitate</p>
            <p>Total</p>
            <p>Sterge</p>
        </div>
        <hr />
        {all_product.map((e)=>{
           if(cartItems[e.id]>0)
            {
                return <div>
                <div className="cartitems-format cartitems-format-main">
                    <img src={e.image} alt="" className='carticon-product-icon'/>
                    <p>{e.name}</p>
                    <p>{e.new_price} RON</p>
                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                    <p>{e.new_price*cartItems[e.id]} RON</p>
                    <img className= 'cartitems-remove-icon'src={remove_icon} onClick={()=> {removeFromCart(e.id)}} alt="" />
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
                        <h3>{getTotalCartAmount()} RON</h3>
                    </div>
                </div>
                <button>Pasul Urmator</button>
            </div>
            <div className="cartitems-promocode">
                <p>Daca ai un promo code, introdu-l aici</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='promo code' />
                    <button>Verifica</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItems