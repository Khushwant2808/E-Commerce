const express = require("express");
const router = express.Router();

const {updateItemInCart,getCartItems} = require("../controllers/cartController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getCartItems);
router.post("/",authenticateToken, updateItemInCart);

module.exports = router;