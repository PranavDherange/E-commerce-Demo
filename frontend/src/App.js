import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
            <Route path="/products" exact element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
    </Router>
  );
}

export default App;
