const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) throw new Error('Token missing');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

exports.getCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req); 
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json({ products: cart.products }); 
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};


// used chatgpt for adding item to cart
// Add an item to the cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const userId = getUserIdFromToken(req);
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const productIndex = cart.products.findIndex((p) => p.productId.equals(productId));

      if (productIndex >= 0) {
        // Update the quantity of the existing product
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add the new product to the cart
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Error adding product to cart", error });
  }
};



// Update an item in the cart
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  try {
    const userId = getUserIdFromToken(req);
    const cart = await Cart.findOneAndUpdate(
      { userId, "products._id": id },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    ).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = getUserIdFromToken(req);
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { _id: id } } },
      { new: true }
    ).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
