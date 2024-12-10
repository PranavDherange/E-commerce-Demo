import React, { useState, useEffect } from 'react';
import './CheckoutPage.css';  // Importing CSS for styling

const CheckoutPage = () => {
  // Local state to hold the cart and discount code
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for API request
  const [error, setError] = useState(null); // Error handling for API requests
  const [userId, setUserId] = useState(null); // State for userId

  // Load cart and userId from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    calculateTotalPrice(savedCart);  // Calculate the initial total price

    // Fetch userId from localStorage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId); // Set userId state if it's available
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  console.log(cart);
  console.log(userId);

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

  // Handle Checkout - make API request to backend
  const handleCheckout = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    const payload = {
      user_id: userId,
      discount_code: discountCode || null,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/v1/orders/${userId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error during checkout');
      }

      const result = await response.json();
      console.log('Checkout successful', result);

      // Clear the cart after successful checkout
      localStorage.removeItem('cart');
      setCart([]);
      setTotalPrice(0);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout failed', error);
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
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

export default CheckoutPage;
