const express = require("express");
const router = express.Router();

const {
    register,
    login,
    verifyToken,
    becomeSeller,
    updateProfile,
    getAllUsers,
    updateUserRole,
    toggleUserSeller,
    deleteUser
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateToken, verifyToken);
router.put("/update-profile", authenticateToken, updateProfile);
router.put("/become-seller", authenticateToken, becomeSeller);

router.get("/users", authenticateToken, getAllUsers);
router.put("/users/:userId/role", authenticateToken, updateUserRole);
router.put("/users/:userId/seller", authenticateToken, toggleUserSeller);
router.delete("/users/:userId", authenticateToken, deleteUser);

module.exports = router;
