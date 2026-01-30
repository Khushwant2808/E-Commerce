const express = require("express");
const router = express.Router();

const { register, login, verifyToken, becomeSeller, updateProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, verifyToken);
router.put("/update-profile", authenticateToken, updateProfile);
router.put("/become-seller", authenticateToken, becomeSeller);

module.exports = router;
