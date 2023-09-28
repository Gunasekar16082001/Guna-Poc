import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage   />} />
        <Route path="/products" element={<ProductsPage  />} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
