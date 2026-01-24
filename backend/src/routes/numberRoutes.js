const express = require("express");
const router = express.Router();

const { addPhoneNumber, getPhoneNumber, updatePhoneNumber } = require("../controllers/numberController")
const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyPhoneNumber, checkIfNumberExists } = require("../middlewares/numberMiddleware");

router.get("/", authenticateToken, checkIfNumberExists, getPhoneNumber);
router.post("/", authenticateToken, checkIfNumberExists, verifyPhoneNumber, addPhoneNumber);
router.put("/", authenticateToken, checkIfNumberExists, verifyPhoneNumber, updatePhoneNumber);

module.exports = router