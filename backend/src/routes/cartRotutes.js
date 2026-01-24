const express = require("express");
const router = express.Router();
const {addItemToCart,getCartItems} = require("../controllers/cartController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getCartItems);
router.post("/add",authenticateToken, addItemToCart);

module.exports = router;