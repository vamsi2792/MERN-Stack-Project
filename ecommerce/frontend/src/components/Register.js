import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import {BACKEND_API_URL} from './Constants';

const Register = () => {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!userName || !userEmail || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter, one special character, and be at least 8 characters long.");
      return;
    }
  
    const userData = {username: userName, email: userEmail, password: password,};
  
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Registration successful:', data);
        setError(""); 
        navigate("/login");
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Error occurred while registering');
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="login-container">
      <div className="centered-content">
        <div className="login-box">
          <h1 className="title">Sign Up</h1>

          <form onSubmit={handleRegister}>
            <input onChange={(e) => setUserName(e.target.value)} className="input-field" type="text" placeholder="UserName" />
            <input onChange={(e) => setUserEmail(e.target.value)} className="input-field" type="text" placeholder="Email Id" />
            <input onChange={(e) => setPassword(e.target.value)} className="input-field" type="password" placeholder="Password"/>
            <input onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" type="password" placeholder="ConfirmPassword"/>
            {error && <span className="error-text">{error}</span>}
            <button className="login-button" type="submit">Register</button>
          </form>
          
          <p className="center-text">Have an Account?</p>
          <Link to="/login"><button className="signin-code-button">Login</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Register;