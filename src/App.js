import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Mainpage from './pages/Mainpage';
import ProductsPage from './pages/ProductsPage';
import BillsHistory from './pages/BillsHistory';
import BillCollection from './pages/BillCollection';
import BillStore from './pages/BillStore';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage   />} />
        <Route path="/products" element={<ProductsPage  />} />
        <Route path="/bill-history" element={<BillsHistory />} />
        <Route path="/bill-store" element={<BillStore />} />
        <Route path="/1" element={<BillCollection />} />
      </Routes>
 </BrowserRouter>
  );
}

export default App;
BillCollection