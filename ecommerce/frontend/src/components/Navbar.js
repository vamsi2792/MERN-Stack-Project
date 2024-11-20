import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false); // Update the state on logout
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };

    checkAuth(); // Check authentication status on initial render

    // Listen for changes to localStorage
    window.addEventListener("storage", checkAuth);

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="title">Anime Vault</h1>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-item">
              Product List
            </Link>
          </li>
          <li>
            <Link to="/wishlist" className="nav-item">
              Wishlist
            </Link>
          </li>
          <li>
            <Link to="/cart" className="nav-item">
              Cart
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <Link to="/myprofile">
                <li className="nav-item">My Profile</li>
              </Link>
              <Link to="/login" onClick={handleLogout}>
                <li className="nav-item">Logout</li>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <li className="nav-item">Login</li>
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
