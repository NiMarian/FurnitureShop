import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = (props) => {
  return (
    <div className='item'>
      <Link to={`/produse/${props.id}`}><img src={props.image} alt={props.name}/></Link> 
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          {props.new_price} RON
        </div>
        <div className="item-price-old">
          {props.old_price} RON
        </div>
      </div>
    </div>
  )
}

export default Item
