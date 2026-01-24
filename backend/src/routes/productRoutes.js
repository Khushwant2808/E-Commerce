const express = require("express");
const router = express.Router();
const { addProduct, getProductById, getProducts } = require("../controllers/productController");
const { authenticateToken } = require("../middlewares/authMiddleware")
const { verifyIfSeller } = require("../middlewares/productMiddleware")

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticateToken, verifyIfSeller, addProduct);

module.exports = router;