const mongoose = require('mongoose');
const Product = require('./models/Product');
const productsData = require('./products.json');

// Load environment variables
require('dotenv').config();

console.log(process.env.MONGODB_URI); // Check if this prints the correct URI


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  await Product.deleteMany({}); // Optional: Clear existing products
  await Product.insertMany(productsData)
    .then(() => console.log('Products imported'))
    .catch((error) => console.error('Error importing products:', error));
  process.exit();
})
.catch((error) => console.error('Error connecting to MongoDB:', error));
