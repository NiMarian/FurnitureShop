import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "mobila",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        console.log(productDetails);
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        formData.append('product', image);

        try {
            let uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
            });
            responseData = await uploadResponse.json();

            if (responseData.success) {
                product.image = responseData.image_url;
                console.log(product);
                let addProductResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
                let addProductData = await addProductResponse.json();
                addProductData.success ? alert("Produs adăugat") : alert("Eșuat");
            } else {
                alert("Eșuat la încărcarea imaginii");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la adăugarea produsului");
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Nume produs</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Scrie aici' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Preț</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Scrie aici' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Preț ofertă</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Scrie aici' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Categorie Produs</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selecter'>
                    <option value="mobila">Mobilă</option>
                    <option value="decoratiuni">Decorațiuni</option>
                    <option value="luminat">Luminat</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button onClick={Add_Product} className='addproduct-btn'>Adaugă</button>
        </div>
    );
};

export default AddProduct;
