import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
import AddPromoCode from '../../Components/AddPromoCode/AddPromoCode'
import Statistics from '../../Components/Statistici/Statistics'

const Admin = () => {
  return (
    <div className='admin'>
        <Sidebar/>
        <Routes>
            <Route path = '/addproduct' element={<AddProduct/>}/>
            <Route path = '/listproduct' element={<ListProduct/>}/>
            <Route path = '/addpromocode' element={<AddPromoCode/>}/>
            <Route path ='/statistics' element={<Statistics />} />
        </Routes>
    </div>
  )
}

export default Admin