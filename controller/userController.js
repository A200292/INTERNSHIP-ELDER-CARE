const User = require("../models/userSchema");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // FIXED typo

// Generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Send JWT + user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    // Check duplicate email
    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Validate email format
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: "Invalid email!" });
    }

    // Passwords must match
    if (req.body.password !== req.body.passwordConfirm) {
      return res
        .status(400)
        .json({ message: "Password and passwordConfirm should match" });
    }

    // Create user
    const newUser = await User.create({
      name: req.body.name, // keep consistent with schema
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      roleDetails: req.body.roleDetails,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await user.checkPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// PROTECT MIDDLEWARE
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // FIXED
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // Verify token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again" });
      }
    }

    // Check user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Check if password changed after token was issued
    if (currentUser.passwordChangedAftertokenIssued(decoded.iat)) {
      return res
        .status(401)
        .json({ message: "Password changed. Please log in again" });
    }

    // Attach user to request
    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
