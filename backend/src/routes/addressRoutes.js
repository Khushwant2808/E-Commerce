const express = require("express");
const router = express.Router();

const { addAddress, getAddresses, updateAddress } = require("../controllers/addressController");
const { authenticateToken } = require("../middlewares/authMiddleware")

router.get("/", authenticateToken, getAddresses)
router.post("/",authenticateToken,  addAddress)
router.put("/", authenticateToken, updateAddress)

module.exports = router