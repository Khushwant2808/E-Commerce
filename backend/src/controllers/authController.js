const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (process.env.LOG === "true") {
      console.log("User registered:", user.id);
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "password", "name", "email", "role", "canSell"],
      raw: true
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        name: user.name,
        role: user.role,
        canSell: user.canSell
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (process.env.LOG === "true") {
      console.log("User logged in:", user.id);
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        canSell: user.canSell
      },
    });

  } catch (error) {

    if (error instanceof Sequelize.DatabaseError) {
      return res.status(500).json({ message: "Database error" });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyToken(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ 
    message: "Token verification successful",
    user: req.user
  });
}

module.exports = {
  register,
  login,
  verifyToken,
};
