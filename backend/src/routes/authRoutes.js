const express = require("express");
const router = express.Router();

const { register, login, verifyToken} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware")

router.post("/register", register);
router.post("/login", login);
router.get('/api/profile', authenticateToken, verifyToken);

module.exports = router;
