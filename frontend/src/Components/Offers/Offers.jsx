import React from 'react'
import './Offers.css'
import exclusive_image from '../Assets/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Ofertă </h1>
            <h1>Exploreaza ofertele chiar acum.</h1>
            <p>Nu mai aștepta !</p>
            <button>Vezi acum !</button>
        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt=""/>
        </div>
    </div>
  )
}

export default Offers