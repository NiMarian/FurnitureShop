import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Magazin from './Pages/Magazin';
import CategorieMagazin from './Pages/CategorieMagazin';
import Produse from './Pages/Produse';
import Cos from './Pages/Cos';
import LoginSignup from './Pages/LoginSignup';
import Checkout from './Pages/Checkout';
import Footer from './Components/Footer/Footer';
import banner_decoratii from './Components/Assets/banner_decoratii.png'
import banner_lumina from './Components/Assets/banner_lumina.png'
import banner_mobila from './Components/Assets/banner_mobila.png'
import ShopContextProvider from './Context/ShopContext';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Magazin/>}/>
        <Route path='/decoratiuni' element={<CategorieMagazin banner = {banner_decoratii} category ="decoratiuni"/>}/>
        <Route path='/luminat' element={<CategorieMagazin banner = {banner_lumina} category ="luminat" />}/>
        <Route path='/mobila' element={<CategorieMagazin banner = {banner_mobila} category ="mobila" />}/>
        <Route path='/produse/:productId' element={<Produse />} />
        <Route path='/cos' element={<Cos/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
