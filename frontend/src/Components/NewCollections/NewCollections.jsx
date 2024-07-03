import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/newcollections')
      .then((response) => response.json())
      .then((data) => {
        console.log("New Collections Data:", data);
        setNew_collection(data);
      });
  }, []);

  return (
    <div className='new-collections'>
      <h1>Colecții noi</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
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

export default NewCollections;
