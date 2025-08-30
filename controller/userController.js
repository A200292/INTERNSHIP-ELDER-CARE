const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Helper: Sign JWT
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ================= Signup =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, role, roleDetails } = req.body;

    // Validate password match
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create user (password hashed automatically via schema pre-save)
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      roleDetails,
    });

    // Sign JWT
    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase();

    // Find user and include password
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Sign token
    const token = signToken(user._id, user.role);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= Protect Middleware =================
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Check if password was changed after token issued
    if (currentUser.passwordChangedAfterTokenIssued(decoded.iat)) {
      return res.status(401).json({ message: "Password recently changed. Please login again." });
    }

    // Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};
