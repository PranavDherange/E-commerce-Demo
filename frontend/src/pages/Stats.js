import React, { useState, useEffect } from 'react';
import './Stats.css';

const Stats = () => {

    const apiUrl = process.env.REACT_APP_API_URL

  // State to hold the fetched data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${apiUrl}v1/admin/stats`);
        
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result.data);  // Assuming the data is in result.data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure the API call is made only once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { total_items, total_amount, total_discount, orders, coupons } = data;

  return (
    <div className="stats-container">
      <h1>Checkout Statistics</h1>

      <div className="stats-summary">
        <div className="stat-item">
          <h2>Total Items</h2>
          <p>{total_items}</p>
        </div>
        <div className="stat-item">
          <h2>Total Amount</h2>
          <p>${total_amount.toFixed(2)}</p>
        </div>
        <div className="stat-item">
          <h2>Total Discount</h2>
          <p>${total_discount.toFixed(2)}</p>
        </div>
      </div>

      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Cart Items</th>
            <th>Total Amount</th>
            <th>Discount Code</th>
            <th>Discount Applied</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.user_id}</td>
              <td>
                {order.cart_items.map((item, index) => (
                  <div key={index}>
                    {item.quantity} x {item.product_name}
                  </div>
                ))}
              </td>
              <td>${order.total_amount.toFixed(2)}</td>
              <td>{order.discount_code || 'N/A'}</td>
              <td>${order.discount_applied.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Coupons</h2>
      <ul className="coupons-list">
        {coupons.map((coupon) => (
          <li key={coupon.coupon_code}>
            <span className="coupon-code">{coupon.coupon_code}</span>
            {/* <span className="coupon-discount">${coupon.discount.toFixed(2)} off</span> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;
