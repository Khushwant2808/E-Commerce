const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const { initializePayment, verifyPayment, getOrderHistory } = require("../controllers/paymentController");

router.post("/init", authenticateToken, initializePayment);
router.post("/verify", authenticateToken, verifyPayment);
router.get("/history/:orderId", authenticateToken, getOrderHistory);

module.exports = router;