import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "./Constants";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must log in to view your cart.");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const products = response.data.products || []; 
      setCart(products); 
      calculateTotal(products); 
    } catch (error) {
      console.error("Error fetching cart:", error);
      setMessage("Failed to fetch cart items.");
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.productId.price); 
      return sum + (price || 0) * item.quantity; 
    }, 0);
    setTotalAmount(total);
  };

  // Used ChatGPT for removing item
  const handleRemove = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must log in to remove items.");
      return;
    }

    try {
      const response = await axios.delete(`${BACKEND_API_URL}/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const updatedCart = cart.filter((item) => item._id !== id);
        setCart(updatedCart);
        calculateTotal(updatedCart);
        setMessage("Item removed from cart.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Failed to remove item.");
    }
  };

  // Used ChatGPT for updating quantity
  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must log in to update quantity.");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_API_URL}/cart/${id}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedCart = cart.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        calculateTotal(updatedCart);
        setMessage("Quantity updated.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setMessage("Failed to update quantity.");
    }
  };

  const handleMoveToWishlist = async (item) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must log in to move items.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/wishlist`,
        { productId: item.productId._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        handleRemove(item._id); 
        setMessage("Item moved to wishlist.");
      }
    } catch (error) {
      console.error("Error moving item to wishlist:", error);
      setMessage("Failed to move item to wishlist.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const displayMessage = message && <div className="message">{message}</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {displayMessage}
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="cart-img"
              />
              <h3>{item.productId.name}</h3>
              <p>Price: ${item.productId.price.toFixed(2)}</p>
              <div className="quantity-container">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, Number(e.target.value))
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <div className="cart-buttons">
                <button onClick={() => handleRemove(item._id)}>Remove</button>
                <button onClick={() => handleMoveToWishlist(item)}>
                  Move to Wishlist
                </button>
              </div>
            </div>
          ))}
          <h3>Total Price: ${totalAmount.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;
