const express = require("express");
const router = express.Router();

const { register, login, verifyToken, becomeSeller } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/api/profile", authenticateToken, verifyToken);
router.put("/become-seller", authenticateToken, becomeSeller);

module.exports = router;
