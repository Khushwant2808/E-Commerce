const express = require("express");
const router = express.Router();
const { addProduct, updateStock, getProducts } = require("../controllers/productController");
const { authenticateToken } = require("../middlewares/authMiddleware")
const { verifyIfSeller } = require("../middlewares/productMiddleware")

router.get("/", getProducts);
router.put("/", authenticateToken, verifyIfSeller, updateStock);
router.post("/", authenticateToken, verifyIfSeller, addProduct);

module.exports = router;