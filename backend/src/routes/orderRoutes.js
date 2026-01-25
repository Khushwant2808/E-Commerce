const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrderById,
  cancelOrder,
  getMyOrders,
  updateOrderStatus,
  updateOrderItemStatus
} = require("../controllers/orderController");

const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getMyOrders);

router.put("/items/:itemId/status", authenticateToken, verifyIfSeller, updateOrderItemStatus);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/cancel", authenticateToken, cancelOrder);
router.put("/:id/status", authenticateToken, verifyIfSeller, updateOrderStatus); 

module.exports = router;