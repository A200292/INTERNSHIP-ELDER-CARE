const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// Test route
router.get("/", (req, res) => res.send("User route works!"));

// Signup
router.post("/signup", userController.signup);

// Login
router.post("/login", userController.login);

// Protected route example
router.get("/profile", userController.protect, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

module.exports = router;
