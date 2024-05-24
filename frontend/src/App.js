import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Magazin from './Pages/Magazin';
import CategorieMagazin from './Pages/CategorieMagazin';
import Produse from './Pages/Produse';
import Cos from './Pages/Cos';
import LoginSignup from './Pages/LoginSignup';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Magazin/>}/>
        <Route path='/decoratiuni' element={<CategorieMagazin category ="decoratiuni"/>}/>
        <Route path='/luminat' element={<CategorieMagazin category ="luminat" />}/>
        <Route path='/mese' element={<CategorieMagazin category ="mese" />}/>
        <Route path='/scaune' element={<CategorieMagazin category ="scaune"/>}/>
        <Route path="/produse" element={<Produse/>}>
          <Route path=':productId' element= {<Produse/>}/>
        </Route>
        <Route path='/cos' element={<Cos/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
