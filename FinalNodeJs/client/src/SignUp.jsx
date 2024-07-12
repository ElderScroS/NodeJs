import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/signup', { email, password });
      navigate('/signin');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <div className="link">
            <span>Already have an account? </span>
            <button type="button" className="login" onClick={() => navigate('/signin')}>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
