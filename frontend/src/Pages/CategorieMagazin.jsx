import React, { useContext, useState, useEffect } from 'react';
import './CSS/CategorieMagazin.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';

const CategorieMagazin = (props) => {
  const { all_product } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    let filtered = all_product.filter(item => item.category === props.category);

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.new_price_with_tva - b.new_price_with_tva);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.new_price_with_tva - a.new_price_with_tva);
    }

    setFilteredProducts(filtered);
    setProductsToShow(filtered.slice(0, visibleCount));
  }, [all_product, props.category, visibleCount, sortOrder]);

  const totalProducts = filteredProducts.length;

  const handleLoadMore = () => {
    if (visibleCount < totalProducts) {
      setVisibleCount(prevCount => Math.min(prevCount + 12, totalProducts));
    } else {
      setVisibleCount(12);
    }
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const buttonText = visibleCount < totalProducts ? 'Descoperă mai multe' : 'Arată mai puțin';

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Se afișează 1-{Math.min(visibleCount, totalProducts)}</span> din {totalProducts} produse
        </p>
        <div className="shopcategory-sort">
          Ordonează după
          <select onChange={handleSortChange} value={sortOrder}>
            <option value="asc">Preț: Crescător</option>
            <option value="desc">Preț: Descrescător</option>
          </select>
        </div>
      </div>
      <div className="shopcategory-products">
        {productsToShow.map((item, i) => (
          <Item 
            key={i} 
            id={item.id} 
            name={item.name} 
            image={item.image} 
            new_price_with_tva={item.new_price_with_tva.toFixed(2)} 
            old_price={item.old_price ? item.old_price.toFixed(2) : null} 
          />
        ))}
      </div>
      {totalProducts > 12 && (
        <button className="shopcategory-loadmore" onClick={handleLoadMore}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default CategorieMagazin;
