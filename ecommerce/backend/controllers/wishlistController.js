const Wishlist = require('../models/Wishlist');
const jwt = require('jsonwebtoken');

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  console.log("ProductId: ", productId);

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const newWishlistItem = new Wishlist({ userId, productId });
    await newWishlistItem.save();

    res.status(201).json({ message: 'Product added to wishlist', newWishlistItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

//  Used ChatGPT for removing item
// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params; 

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await Wishlist.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const wishlistItems = await Wishlist.find({ userId }).populate('productId');

    if (!wishlistItems || wishlistItems.length === 0) {
      return res.status(404).json({ message: 'No items in wishlist' });
    }

    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};
