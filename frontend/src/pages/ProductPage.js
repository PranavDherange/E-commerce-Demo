import React, { useState, useEffect } from 'react';
import './ProductPage.css';  // Importing CSS for styling

const ProductPage = () => {
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

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Function to add an item to the cart
  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      // If it exists, update the quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
    } else {
      // If it doesn't exist, add the product to the cart
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
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
