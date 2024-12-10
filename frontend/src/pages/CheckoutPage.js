import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';  // Importing CSS for styling

const CheckoutPage = () => {
  // Local state to hold the cart and discount code
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    calculateTotalPrice(savedCart);  // Calculate the initial total price
  }, []);

  // Function to calculate the total price of the cart
  const calculateTotalPrice = (cartItems) => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(subtotal - discountAmount);  // Apply discount if any
  };

  // Handle discount code input
  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
  };

  // Handle Apply Discount Code
  const applyDiscount = () => {
    const validCodes = ['DISCOUNT10', 'DISCOUNT20'];  // Example valid discount codes
    let discount = 0;

    if (validCodes.includes(discountCode)) {
      if (discountCode === 'DISCOUNT10') {
        discount = totalPrice * 0.10;  // 10% discount
      } else if (discountCode === 'DISCOUNT20') {
        discount = totalPrice * 0.20;  // 20% discount
      }
    } else {
      alert('Invalid discount code');
    }

    setDiscountAmount(discount);
    calculateTotalPrice(cart);  // Recalculate total price after discount
  };

  // Handle Checkout
  const handleCheckout = () => {
    alert('Order placed successfully!');
    // Here, you can send the order data to the backend for processing
    localStorage.removeItem('cart');  // Clear cart after order
    setCart([]);  // Clear cart in the state
    setTotalPrice(0);  // Reset total price
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty. Please add some items to your cart.</p>
      ) : (
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <p>{item.name} x {item.quantity}</p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="discount-section">
            <input
              type="text"
              value={discountCode}
              onChange={handleDiscountChange}
              placeholder="Enter discount code"
            />
            <button onClick={applyDiscount}>Apply Discount</button>
          </div>
          <div className="total-price">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <p>Discount Applied: ${discountAmount.toFixed(2)}</p>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage
