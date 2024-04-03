import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import Success from './Pages/Success/Success';
import Login from './components/Login';
import './App.css'
import Signup from './components/Signup';
import RenderMenu from './components/RenderMenu';
import Cart from './components/Cart';
import Adress from './components/Adress'
import OrderSuccess from './components/OrderSuccess'; // Corrected import statement
import ViewOrders from './components/ViewOrders';
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/success' element={<Success/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path = '/login' element = {<Login />} />
          <Route path = '/signup' element = {<Signup />} />
          <Route path = '/rendermenu' element = {<RenderMenu />} />
          <Route path = "/cart" element = {<Cart />} />
          <Route path = "/adress" element = {<Adress/>} />
          <Route path="/order-success" element={<OrderSuccess />} /> {/* Corrected route path */}
          <Route path = "/myorders" element = {<ViewOrders />} />
        </Routes>
        <Toaster/>
      </Router>
    </>
  )
}

export default App
