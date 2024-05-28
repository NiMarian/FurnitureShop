import React, { useEffect,useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {

    const [allproducts,setAllProducts] = useState([]);

    const fetchInfo = async () =>{
        await fetch('http://localhost:4000/allproducts')
        .then((res)=>res.json())
        .then((data)=>{setAllProducts(data)});   
    }

    useEffect(()=>{
        fetchInfo();
    },[])

    const remove_product = async (id) =>{
        await fetch('http://localhost:4000/removeproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
    }

  return (
    <div className='list-product'>
        <h1>Toate produsele</h1>
        <div className="listproduct-format-main">
            <p>Produse</p>
            <p>Nume</p>
            <p>Pret vechi</p>
            <p>Pret nou</p>
            <p>Categorie</p>
            <p>Sterge</p>
        </div>
        <div className="listproduct-allproducts">
            <hr />
            {allproducts.map((product,index)=>{
                return <><div key={index} className="listproduct-format-main listproduct-format">
                    <img src={product.image} alt="" className="listproduct-product-icon" />
                    <p>{product.name}</p>
                    <p>{product.old_price} RON</p>
                    <p>{product.new_price} RON</p>
                    <p>{product.category}</p>
                    <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt="" />
                </div>
                <hr />
                </>
            })}
        </div>
    </div>
  )
}

export default ListProduct