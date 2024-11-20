const express = require("express");
const { registerUser, loginUser, authenticateToken, updateUsername } = require("./../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
router.put("/update", authenticateToken, updateUsername);

module.exports = router;
