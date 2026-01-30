const bcrypt = require("bcryptjs");
const { User, PhoneNumber } = require("../models");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

async function register(req, res, next) {
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

    console.log('[Auth] User registered:', user.email, 'ID:', user.id);

    // Generate JWT token for immediate login
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        canSell: user.canSell
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        canSell: user.canSell,
        phone: null // New user has no phone yet
      }
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: error.errors.map(e => e.message)
      });
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      where: { email },
      include: [PhoneNumber]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        canSell: user.canSell
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log('[Auth] User logged in:', user.email, 'ID:', user.id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        canSell: user.canSell,
        phone: user.PhoneNumber?.phone
      }
    });
  } catch (error) {
    if (error instanceof Sequelize.DatabaseError) {
      return res.status(500).json({ message: "Database error" });
    }

    next(error);
  }
}

async function verifyToken(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id, {
      include: [{ model: PhoneNumber, as: 'PhoneNumber' }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Token verification successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        canSell: user.canSell,
        phone: user.PhoneNumber?.phone
      }
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    if (phone) {
      let phoneNumber = await PhoneNumber.findOne({ where: { userId } });
      if (phoneNumber) {
        phoneNumber.phone = phone;
        await phoneNumber.save();
      } else {
        await PhoneNumber.create({ userId, phone });
      }
    }

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: PhoneNumber, as: 'PhoneNumber' }]
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        canSell: updatedUser.canSell,
        phone: updatedUser.PhoneNumber?.phone
      }
    });
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({ message: "Email or phone number already in use" });
    }
    next(error);
  }
}

async function becomeSeller(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.canSell) {
      return res.status(400).json({ message: "You are already a seller" });
    }

    user.canSell = true;
    await user.save();

    return res.status(200).json({
      message: "Congratulations! You are now a seller.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        canSell: user.canSell,
        phone: user.PhoneNumber?.phone
      }
    });
  } catch (error) {
    await transaction?.rollback();
    next(error);
  }
}

module.exports = {
  register,
  login,
  verifyToken,
  updateProfile,
  becomeSeller
};
