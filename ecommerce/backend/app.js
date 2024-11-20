const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotEnv = require("dotenv");

const bodyParser = require("body-parser");

const path = require("path");
dotEnv.config();

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./../frontend/build")));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Catch-all handler for any requests not handled by above routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./../frontend/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
