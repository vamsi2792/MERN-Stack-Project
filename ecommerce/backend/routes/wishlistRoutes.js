const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

// Route to get all wishlist items
router.get('/', wishlistController.getWishlist);

// Route to add an item to the wishlist
router.post('/', wishlistController.addToWishlist);

// Route to remove an item from the wishlist
router.delete('/:id', wishlistController.removeFromWishlist);

module.exports = router;
