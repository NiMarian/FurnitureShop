import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

const Magazin = () => {
  useEffect(() => {
    // Afișează o alertă când componenta Magazin este montată
    alert('ACEASTĂ PAGINĂ NU REPREZINTĂ UN MAGAZIN REAL!!!\nAcest magazin fictiv este creat de Nicuță Marian');
  }, []);
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollections/>
      <NewsLetter/>
    </div>
  )
}

export default Magazin;