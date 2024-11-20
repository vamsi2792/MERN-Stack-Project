import React, { useState, useEffect } from "react";
import ProductDetails from "./ProductDetails";
import {BACKEND_API_URL }from "./Constants";
import axios from "axios";

const ListOfProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    <div className="product-list">
      <h2>List of Products</h2>
      <div className="products">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductDetails key={product.id} product={product} />
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default ListOfProducts;
