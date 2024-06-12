import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);
    const [editingStock, setEditingStock] = useState(null);
    const [newStock, setNewStock] = useState(0);

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => { setAllProducts(data) });
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    const remove_product = async (id) => {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        await fetchInfo();
    }

    const updateStock = async (id) => {
        await fetch('http://localhost:4000/updatestock', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, stock: newStock })
        })
        setEditingStock(null);
        await fetchInfo();
    }

    const handleRemoveClick = (id) => {
        if (window.confirm("Sigur vrei să ștergi acest produs?")) {
            remove_product(id);
        }
    }

    return (
        <div className='list-product'>
            <h1>Toate produsele</h1>
            <div className="listproduct-format-main">
                <p>Produse</p>
                <p>Nume</p>
                <p>Preț vechi</p>
                <p>Preț nou</p>
                <p>Categorie</p>
                <p>Stoc</p>
                <p>Șterge</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allproducts.map((product, index) => {
                    return <><div key={index} className="listproduct-format-main listproduct-format">
                        <img src={product.image} alt="" className="listproduct-product-icon" />
                        <p>{product.name}</p>
                        <p>{product.old_price} RON</p>
                        <p>{product.new_price} RON</p>
                        <p>{product.category}</p>
                        {editingStock === product.id ? (
                            <>
                                <input
                                    type="number"
                                    value={newStock}
                                    onChange={(e) => setNewStock(e.target.value)}
                                />
                                <button className="listproduct-button listproduct-button-save" onClick={() => updateStock(product.id)}>Salvează</button>
                                <button className="listproduct-button listproduct-button-cancel" onClick={() => setEditingStock(null)}>Anuleaza</button>
                            </>
                        ) : (
                            <>
                                <p>{product.stock}</p>
                                <button className="listproduct-button listproduct-button-edit" onClick={() => { setEditingStock(product.id); setNewStock(product.stock); }}>Modifică</button>
                            </>
                        )}
                        <img onClick={() => handleRemoveClick(product.id)} className='listproduct-remove-icon' src={cross_icon} alt="" />
                    </div>
                        <hr />
                    </>
                })}
            </div>
        </div>
    )
}


export default ListProduct;
