import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    if (userId) {
      // Save user ID in localStorage or state
      localStorage.setItem('userId', userId);
      history.push('/products'); // Redirect to the products page
    } else {
      alert('Please enter a valid user ID.');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <input
        type="number"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
