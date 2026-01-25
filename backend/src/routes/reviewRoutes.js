const express = require("express");
const router = express.Router();

const { getProductRating, updateReview, addReview } = require("../controllers/reviewController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/:productId", getProductRating);
router.post("/", authenticateToken, addReview);
router.put("/", authenticateToken, updateReview);

module.exports = router;
