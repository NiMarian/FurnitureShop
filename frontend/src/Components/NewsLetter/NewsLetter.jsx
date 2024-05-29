import React, { useState } from 'react'
import './NewsLetter.css'

const NewsLetter = () => {

  const [email, setEmail] = useState('');

  const handleSubscribe = async () =>{
    try {
      const response = await fetch("http://localhost:4000/subscribe",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({email})
      });

      const result = await response.json();
      if(result.success){
        alert('Te-ai abonat cu succes la Exotique !');
      }
      else {
        alert('Nu ai reusit sa te abonezi, incearca din nou.');
      }
    } catch(error){
      console.error('Eroare la abonarea newsletter: ',error);
      alert("A intervenit o eroare. Incearca din nou");
    }
  };

  

  return (
    <div className='newsletter'>
        <h1>Primește oferte exclusive pe email</h1>
        <p>Abonați-vă la newsletter-ul nostru și rămâneți la curent cu noutățile.</p>
        <div>
            <input
             type="email"
             placeholder='Your Email'
             value={email}
             onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter