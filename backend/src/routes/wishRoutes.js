const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middlewares/authMiddleware");
const { getWishlist, addToWishList } = require("../controllers/wishController");

router.get("/", authenticateToken, getWishlist);
router.post("/", authenticateToken, addToWishList);

module.exports = router;