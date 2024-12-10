import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import CSS for styling

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!userId) {
      setError('Please enter a valid user ID.');
    } else {
      localStorage.setItem('userId', userId); // Save the user ID in local storage
      navigate('/products'); // Navigate to the products page
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to the E-Commerce</h1>
        <p className="login-subtitle">Please enter your user ID to continue</p>
        
        <div className="input-container">
          <input
            type="number"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="login-input"
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}

        <div className="button-container">
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
