import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularindecoratiuni')
      .then((response) => response.json())
      .then((data) => {
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
              new_price_with_tva={item.new_price_with_tva.toFixed(2)} 
            old_price={item.old_price ? item.old_price.toFixed(2) : null} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
