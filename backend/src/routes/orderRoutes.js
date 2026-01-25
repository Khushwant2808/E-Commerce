const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrderById,
  cancelOrder,
  getMyOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getMyOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/cancel", authenticateToken, cancelOrder);
router.put("/:id/status", authenticateToken, verifyIfSeller, updateOrderStatus);
module.exports = router;