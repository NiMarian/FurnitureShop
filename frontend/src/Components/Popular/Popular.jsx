import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularindecoratiuni')
      .then((response) => response.json())
      .then((data) => {
        console.log("Popular Products Data:", data);  // Adaugă această linie
        setPopularProducts(data);
      });
  }, []);

  return (
    <div className='popular'>
      <h1>Produse populare</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return (
            <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price_with_tva={item.new_price_with_tva} 
              old_price={item.old_price} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
