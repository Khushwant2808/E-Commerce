const express = require("express");
const router = express.Router();
const{getOrderdetails} = require("../controllers/orderController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, getOrderdetails);

module.exports = router;