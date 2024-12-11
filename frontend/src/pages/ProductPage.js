import React, { useState, useEffect } from 'react';
import './ProductPage.css';  // Importing CSS for styling
import axios from 'axios';

const ProductPage = () => {

  const apiUrl = process.env.REACT_APP_API_URL
  // Sample products data
  const products = [
    { id: 1, name: 'MacBook Pro', price: 1999.99 },
    { id: 2, name: 'MacBook Air', price: 999.99 },
    { id: 3, name: 'iPhone 13', price: 799.99 },
    { id: 4, name: 'AirPods Pro', price: 249.99 },
    { id: 5, name: 'Apple Watch', price: 399.99 },
    { id: 6, name: 'iPad Pro', price: 799.99 },
  ];

  // Local state to hold the cart
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);  // Keep track of the user_id

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    // Get user_id from localStorage
    const savedUserId = localStorage.getItem('userId'); 
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      console.error('No user_id found in localStorage');
    }
  }, []);

  // Function to add an item to the cart
  const addToCart = async (product) => {
    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    let updatedCart;
    if (existingProductIndex !== -1) {
      // If it exists, update the quantity
      updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // If it doesn't exist, add the product to the cart
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    // Update local state and localStorage
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    

    // Call the backend API to update the cart (POST request)
    try {
      const response = await axios.post(`${apiUrl}v1/orders/${userId}/add_item`, {
          product_name: product.name,
          quantity: 1,
          price: product.price,
      });

      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }

  };

  return (
    <div className="product-page">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="cart-info">
        <p>Items in Cart: {cart.reduce((total, item) => total + item.quantity, 0)}</p>
      </div>
    </div>
  );
};

export default ProductPage;
