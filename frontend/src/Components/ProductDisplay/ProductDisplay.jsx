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
                    <h3>Produse din Lemn</h3>
                    <p>
                        Produsele din lemn aduc o notă naturală și rustică în orice spațiu, fiind apreciate pentru durabilitatea și estetica lor unică. Aceste produse sunt adesea realizate manual, evidențiind măiestria meșteșugarilor și frumusețea fibrei lemnoase naturale.
                    </p>
                    <h3>Decorațiuni</h3>
                    <p>
                        Decorațiunile sunt elementele care transformă o casă într-un cămin, adăugând personalitate și stil fiecărei încăperi, fiecare aducând o textură și un caracter distinct.
                    </p>
                    <h3>Iluminat</h3>
                    <p>
                        Corpurile de iluminat sunt esențiale nu doar pentru funcționalitatea lor, ci și pentru ambianța pe care o creează.
                    </p>
                </div>

                <button onClick={() => { addToCart(product.id) }}>Adauga in cos</button>
                <p className='productdisplay-right-category'><span>Categorie :</span>Decorațiuni, Statui, Vaze, Etajeră </p>
                <p className='productdisplay-right-category'><span>Tags :</span>Modern, Lemn</p>
            </div>
        </div>
    );
}

export default ProductDisplay;
