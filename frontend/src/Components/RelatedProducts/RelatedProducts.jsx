import React, { useContext } from 'react';
import './RelatedProducts.css';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RelatedProducts = ({ category }) => {
  const { all_product } = useContext(ShopContext);
  const relatedProducts = all_product.filter(product => product.category === category);
  const shuffledProducts = shuffleArray(relatedProducts);
  const displayedProducts = shuffledProducts.slice(0, 5);

  return (
    <div className='relatedproducts'>
      <h1>Produse asemănătoare: </h1>
      <hr />
      <div className="relatedproducts-item">
        {displayedProducts.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price={item.new_price_with_tva} 
            old_price={item.old_price} 
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
