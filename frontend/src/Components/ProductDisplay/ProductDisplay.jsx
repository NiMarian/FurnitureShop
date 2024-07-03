import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        } else {
            setQuantity(1);
        }
    };

    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt="Product Thumbnail" />
                    <img src={product.image} alt="Product Thumbnail" />
                    <img src={product.image} alt="Product Thumbnail" />
                    <img src={product.image} alt="Product Thumbnail" />
                </div>
                <div className="productdisplay-img">
                    <img className='productdisplay-main-img' src={product.image} alt="Main Product" />
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-prices">
                    <div className="product-right-price-old">
                        {product.old_price} RON
                    </div>
                    <div className="product-right-price-new">
                        {product.new_price_with_tva} RON
                    </div>
                </div>
                <div className="productdisplay-right-description">
                    <h3>Descriere</h3>
                    <p>{product.description}</p>
                </div>
                <div className="productdisplay-quantity">
                    <label htmlFor="quantity">Cantitate:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                    />
                </div>
                <button onClick={() => addToCart(product.id, quantity)}>Adaugă în coș</button>
                <div className="productdisplay-right-category">
                    <span>Categorie: {product.category}</span>
                </div>
            </div>
        </div>
    );
}

export default ProductDisplay;
