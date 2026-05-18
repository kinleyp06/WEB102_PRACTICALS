const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// In-memory database
const users = [];

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required.",
    });
  }

  // Check existing user
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists.",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully!",
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required.",
    });
  }

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  // JWT token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "1d",
    },
  );

  res.json({
    message: "Login successful!",
    token,
  });
});

// GET USERS
router.get("/users", (req, res) => {
  const safeUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  res.json(safeUsers);
});

module.exports = router;
