import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Viewproduct.css";
import { BACKEND_API_URL } from "./Constants";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setMessage("Error fetching product. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartAndWishlist = async () => {
      try {
        const cartResponse = await axios.get(`${BACKEND_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setCart(cartResponse.data.products || []);

        const wishlistResponse = await axios.get(`${BACKEND_API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setWishlist(wishlistResponse.data.products || []);
      } catch (error) {
        console.error("Error fetching cart or wishlist:", error);
      }
    };

    fetchProduct();
    fetchCartAndWishlist();
  }, [id]);

  const checkAuthAndProceed = () => {
    if (!localStorage.getItem("authToken")) {
      setMessage("Please log in to perform this action.");
      navigate("/login");
      return false;
    }
    return true;
  };

  // Used ChatGPT for adding item to cart
  const addToCart = async () => {
    if (!checkAuthAndProceed()) return;

    if (product.stock === 0) {
      setMessage(`${product.name} is out of stock!`);
      return;
    }
    try {
      console.log("Adding product to cart:", { productId: product._id, quantity: 1 });

      const response = await axios.post(
        `${BACKEND_API_URL}/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      console.log("Add to Cart Response:", response.data);
      setMessage(`${product.name} has been added to your cart!`);
      setCart([...cart, { productId: product, quantity: 1 }]);
    } catch (error) {
      console.error("Error adding to cart:", error.response || error.message);
      setMessage("Failed to add to cart. Please try again.");
    }
  };

  const addToWishlist = async () => {
    if (!checkAuthAndProceed()) return;
  
    const currentWishlist = wishlist || [];

    const isProductInWishlist = currentWishlist.some((item) => item._id === product._id);
  
    if (isProductInWishlist) {
      setMessage(`${product.name} is already in your wishlist!`);
      return; 
    }
  
    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/wishlist`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
  
      if (response.status === 200) {
        setWishlist([...currentWishlist, { ...product }]); 
        setMessage(`${product.name} has been added to your wishlist!`);
      }
    } catch (error) {
      setMessage(`${product.name} has been added in your wishlist!`);
      console.error("Error adding to wishlist:", error);
    }
  
    setTimeout(() => setMessage(""), 3000);
  };
  

  if (loading) return <p>Loading product...</p>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-back">
      <div className="view-product">
        <img src={product.image} alt={product.name} className="product-image" />
        <h2 className="product-title">{product.name}</h2>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-buttons">
          <button
            className="add-to-cart"
            onClick={addToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
          <button className="add-to-wishlist" onClick={addToWishlist}>
            Add to Wishlist
          </button>
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default ViewProduct;
