const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Boolean, required: true },
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
