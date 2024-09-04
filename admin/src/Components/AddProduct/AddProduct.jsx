import React, { useState, useEffect } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(false);
    const [productDetails, setProductDetails] = useState({
        id: "",
        name: "",
        image: "",
        category: "mobila",
        new_price: "",
        old_price: "",
        description: ""
    });

    useEffect(() => {
        const fetchMaxId = async () => {
            try {
                const response = await fetch('https://furnitureshop-backend.onrender.com/maxProductId');
                const data = await response.json();
                if (data.success) {
                    setProductDetails(prevDetails => ({
                        ...prevDetails,
                        id: data.maxId + 1 
                    }));
                } else {
                    console.error('Nu s-a reușit obținerea celui mai mare ID de produs');
                }
            } catch (error) {
                console.error('Nu s-a reușit obținerea celui mai mare ID de produs:', error);
            }
        };

        fetchMaxId();
    }, []);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const isNumeric = (value) => {
        return /^\d+(\.\d+)?$/.test(value);
    };

    const Add_Product = async () => {
        const { new_price, old_price } = productDetails;

        if (!isNumeric(new_price) || !isNumeric(old_price)) {
            alert("Prețul nu poate conține litere. Te rog introdu doar numere.");
            return;
        }

        console.log(productDetails);
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        formData.append('product', image);

        try {
            let uploadResponse = await fetch('https://furnitureshop-backend.onrender.com/upload', {
                method: 'POST',
                body: formData,
            });
            responseData = await uploadResponse.json();

            if (responseData.success) {
                product.image = responseData.image_url;
                console.log(product);
                try {
                    let addProductResponse = await fetch('https://furnitureshop-backend.onrender.com/addproduct', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(product),
                    });
                    if (!addProductResponse.ok) {
                        throw new Error('Server responded with status ' + addProductResponse.status);
                    }
                    let addProductData = await addProductResponse.json();
                    addProductData.success ? alert("Produs adăugat") : alert("Eșuat");
                } catch (error) {
                    console.error("Produsul nu poate avea litere in pret:", error);
                    alert("Produsul nu poate avea litere în preț.");
                }
            } else {
                alert("Eșuat la încărcarea imaginii");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Eroare la încărcarea imaginii");
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
                <p>Descriere</p>
                <textarea value={productDetails.description} onChange={changeHandler} name='description' placeholder='Scrie aici' rows="4" />
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
