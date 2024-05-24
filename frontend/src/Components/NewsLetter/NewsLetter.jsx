import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Primeste oferte exclusive pe email</h1>
        <p>Abonați-vă la newsletter-ul nostru și rămâneți la curent cu noutățile.</p>
        <div>
            <input type="email" placeholder='Your Email' />
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter