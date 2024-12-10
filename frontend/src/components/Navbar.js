import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';  // Importing cart icon from react-icons
import './Navbar.css';

const Navbar = () => {
  // Assuming cart is an array of items added to the cart
  const [cart, setCart] = useState([]);  // State to hold the cart items

  // This is just for illustration. In a real app, the cart would be managed globally or fetched from an API.
  useEffect(() => {
    // Example: Load cart from localStorage or global state (e.g., Context, Redux)
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Function to update cart
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));  // Save to localStorage
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>My E-Commerce</h2>
      </div>
      <div className="navbar-links">
        <ul>
          <li><a href="/login">Login</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/checkout">Checkout</a></li>
        </ul>
      </div>
      <div className="navbar-cart">
        <a href="/checkout">
          <FaShoppingCart size={30} color="#fff" />
          {/* Cart count */}
          {cart.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
