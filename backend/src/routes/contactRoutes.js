const express = require("express");
const router = express.Router();
const { submitMessage, getMyMessages, getAllMessages } = require("../controllers/contactController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", authenticateToken, submitMessage);
router.get("/my", authenticateToken, getMyMessages);

router.get("/admin/all", authenticateToken, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}, getAllMessages);

module.exports = router;
