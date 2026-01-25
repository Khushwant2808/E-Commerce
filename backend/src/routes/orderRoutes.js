const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrderById,
  cancelOrder,
  getMyOrders,
  updateOrderStatus,
  updateOrderItemStatus // Import the new controller
} = require("../controllers/orderController");

const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

router.post("/", authenticateToken, placeOrder);
router.get("/", authenticateToken, getMyOrders);

// --- SPECIFIC ROUTES FIRST ---
// This handles the ITEM status (Use a clearer path to avoid conflict)
// Using "items" as the literal path
router.put("/items/:itemId/status", authenticateToken, verifyIfSeller, updateOrderItemStatus);

// --- GENERIC ROUTES LAST ---
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/cancel", authenticateToken, cancelOrder);
router.put("/:id/status", authenticateToken, verifyIfSeller, updateOrderStatus); // Legacy/Admin route

module.exports = router;