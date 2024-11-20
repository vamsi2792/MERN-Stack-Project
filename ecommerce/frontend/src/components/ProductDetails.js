import React from "react";
import { Link } from "react-router-dom";

const ProductDetails = ({ product }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: ${product.price.toFixed(2)}</p>
      <Link to={`/product/${product._id}`} className="view-link">View</Link>

    </div>
  );
};

export default ProductDetails;
