const express = require("express");
const router = express.Router();

const { addToCart, removeFromCart, incrementCartItem, decrementCartItem, getCartItems } = require("../controllers/cartController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getCartItems);
router.post("/add", authenticateToken, addToCart);
router.post("/remove", authenticateToken, removeFromCart);
router.put("/increment", authenticateToken, incrementCartItem);
router.put("/decrement", authenticateToken, decrementCartItem);

module.exports = router;