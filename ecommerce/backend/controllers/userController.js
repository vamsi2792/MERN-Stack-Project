const User = require("./../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;
console.log('JWT Secret:', SECRET_KEY);

// Register User
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error during user login:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Protect routes using JWT (middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; 
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Update username
const updateUsername = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Token is: ", token);
    if (!token) return res.status(401).json({ message: 'Token missing' });

    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { username } = req.body;  

    // Validate the new username
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Update the user's username
    const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user info back in the response
    res.json({ message: "Username updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser, authenticateToken, updateUsername };
