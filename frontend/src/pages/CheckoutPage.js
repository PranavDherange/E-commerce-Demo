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
  const [ordersCount, setOrdersCount] = useState(0);  // New state to store the number of orders
  const [couponCode, setCouponCode] = useState(null);  // Store coupon code if applicable
  const [isDiscountButtonEnabled, setDiscountButtonEnabled] = useState(false);  // Enable/Disable discount button

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

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    const initialSubtotal = savedCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(initialSubtotal);  // Set the initial total price
  }, []);
  

    // Fetch orders and update the discount button and coupon code logic
    useEffect(() => {
        if (userId) {
          fetchOrders(userId);
        }
      }, [userId]);

    const fetchOrders = async (userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/v1/orders/${userId}/orders`);
          const data = await response.json();
    
          if (data.status === 'success') {
            const orders = data.data.orders;
            setOrdersCount(orders.length);
    
            // Enable discount button if the order count is a multiple of 2
            if ((orders.length+1) % 2 === 0) {
              setDiscountButtonEnabled(true);
              fetchCouponCode();
            } else {
              setDiscountButtonEnabled(false);
            }
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
          setError('Failed to fetch orders');
        }
    };

    const fetchCouponCode = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/v1/admin/generate_coupon`);
          const data = await response.json();
    
          if (data.status === 'success') {
            setCouponCode(data.data.coupon_code);
            setDiscountCode(data.data.coupon_code); // Autofill coupon code into the discount input
          } else {
            setCouponCode(null);
          }
        } catch (error) {
          console.error('Failed to fetch coupon code:', error);
        }
      };

  // Function to calculate the total price of the cart
  const calculateTotalPrice = (subtotal, discount) => {
    const finalPrice = subtotal - discount; // Apply discount directly
    setTotalPrice(finalPrice); // Update the total price with the discount applied
  };

  // Handle discount code input
  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
  };

  const applyDiscount = () => {
    // Apply a 10% discount based on the subtotal (without any discount applied)
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discount = subtotal * 0.10;  // 10% discount
    setDiscountAmount(discount);  // Set the discount amount
    calculateTotalPrice(subtotal, discount);  // Recalculate total price with the discount
  };


  // Handle Checkout - make API request to backend
  const handleCheckout = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    // Calculate the total amount for the cart items (subtotal)
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Set the discount amount
    const discountApplied = discountAmount > 0 ? discountAmount : 0;

    // Calculate the final total amount after applying the discount
    const totalAmount = subtotal - discountApplied;

    const payload = {
      user_id: userId,
      total_amount: totalAmount,  // Send the total amount after discount
      discount_code: discountCode || null,
      discount_applied: discountApplied > 0 ? discountApplied : 0,  // Include the discount applied if any
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
              disabled={!isDiscountButtonEnabled}
            />
            <button
              onClick={applyDiscount}
              disabled={!isDiscountButtonEnabled}
            >
              Apply Discount
            </button>
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

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CheckoutPage;
