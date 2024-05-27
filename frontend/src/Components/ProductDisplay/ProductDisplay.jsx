import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    
    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                    <img src={product.image} alt="" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-star">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>122</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="product-right-price-old">
                        {product.old_price} RON
                    </div>
                    <div className="product-right-price-new">
                        {product.new_price} RON
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    Produs fsdfjsdfkgleytsbguyrsbdfslbjhgblfdsagbhjdsfhbjghbjsdkfgkhbjdfskhjbgkhbjdfshgjbdsfhjbghjbdfhbjgsdh
                </div>
                <button onClick={() => { addToCart(product.id) }}>Adauga in cos</button>
                <p className='productdisplay-right-category'><span>Categorie :</span>Decoratiuni , Statui, Vaze , Etajera </p>
                <p className='productdisplay-right-category'><span>Tags :</span>Moderna, Lemn</p>
            </div>
        </div>
    );
}

export default ProductDisplay;
