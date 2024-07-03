import React from 'react'
import './Hero.css'
import hero_image from '../Assets/hero_image.png'


const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>Doar produse noi, intrâ acum</h2>
            <div>
                <div>
                    <p>Noi</p>
                </div>
                <p>Colecții</p>
                <p>pentru oricine</p>
            </div>
        </div>
        <div className="hero-right">
            <img src={hero_image} alt=""/>
        </div>
    </div>
  )
}

export default Hero;