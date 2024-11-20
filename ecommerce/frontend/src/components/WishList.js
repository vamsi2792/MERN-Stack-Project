import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Wishlist.css";
import { BACKEND_API_URL } from "./Constants";

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");

  // Fetch Wishlist from the backend
  const fetchWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setWishlist(response.data || []);
      console.log("Fetched Wishlist Data:", response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchWishlist();
    }
  }, [authToken, fetchWishlist]);

  // Remove an item from the wishlist
  const removeFromWishlist = async (id) => {
    try {
      await axios.delete(`${BACKEND_API_URL}/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      setMessage("Item removed from wishlist!");

      if (wishlist.length === 1) {
        setWishlist([]); 
      } else {
        fetchWishlist(); 
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      setMessage("Failed to remove item. Please try again.");
    }
  };
  
 // Used chatgpt for moving item to cart
  const moveToCart = async (product) => {
    if (product.stock <= 0) {
      alert(`Sorry, ${product.name} is out of stock and cannot be moved to the cart.`);
      return;
    }
  
    try {
      await axios.post(
        `${BACKEND_API_URL}/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setMessage(`${product.name} has been moved to the cart!`);
      fetchWishlist();
    } catch (error) {
      console.error("Error moving item to cart:", error);
      setMessage("Failed to move item to cart. Please try again.");
    }
  };
  
  if (!authToken) {
    return (
      <div className="invalid-user">
        <h2>Access Denied</h2>
        <p>You must log in to view your Wishlist.</p>
        <button onClick={() => (window.location.href = "/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {message && <div className="message">{message}</div>}
      {isLoading ? (
        <p>Loading wishlist...</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            wishlist.map((item) => {
              const product = item.productId; 
              return (
                <div key={item._id} className="wishlist-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-img"
                  />
                  <div className="wishlist-item-info">
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price.toFixed(2)}</p>
                  </div>
                  <div className="wishlist-buttons">
                    <button
                      className="move-to-cart"
                      onClick={() => moveToCart(product)}
                    >
                      Move to Cart
                    </button>
                    <button
                      className="remove-from-wishlist"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default WishList;
