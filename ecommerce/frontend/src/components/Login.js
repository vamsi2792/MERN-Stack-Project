import React from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BACKEND_API_URL } from './Constants';

const Login = () => {

  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const userData = { email: userEmail, password: password };
  
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login successful:", data);
        setError("");
        localStorage.setItem("authToken", data.token);
  
        // Notify the Navbar about login
        window.dispatchEvent(new Event("storage"));
  
        navigate("/");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Error occurred while logging in");
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="login-container">
      <div className="centered-content">
        <div className="login-box">
          <h1 className="title">Sign In</h1>

          <form onSubmit={handleLogin}>
            <input onChange={(e) => setUserEmail(e.target.value)} className="input-field" type="text" placeholder="Email Id" />
            <input onChange={(e) => setPassword(e.target.value)} className="input-field" type="password" placeholder="Password"/>
            {error && <span className="error-text">{error}</span>}
            <button className="login-button">Login</button>
          </form>

          <p className="center-text">Don't have an Account?</p>
          <Link to="/register"><button className="signin-code-button">Create Account</button></Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
