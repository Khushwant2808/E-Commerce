const express = require("express");
const router = express.Router();
const{getOrderdetails , placeOrder} = require("../controllers/orderController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getOrderdetails);
router.post("/", authenticateToken, placeOrder);
module.exports = router;