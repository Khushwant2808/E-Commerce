const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authMiddleware");
const { getWishlist, addToWishList, removeFromWishlist } = require("../controllers/wishController");

router.get("/", authenticateToken, getWishlist);
router.post("/", authenticateToken, addToWishList);
router.delete('/:productId', authenticateToken, removeFromWishlist);

module.exports = router;