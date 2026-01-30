const express = require("express");
const router = express.Router();

const { getProducts, getProductById, updateStock, updateProductMeta, addProduct, showProducts, deleteProduct } = require("../controllers/productController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/show", authenticateToken, verifyIfSeller, showProducts);
router.get("/:id", getProductById); // Must be after /show to not match "show" as :id

// Seller-only routes
router.post("/", authenticateToken, verifyIfSeller, addProduct);
router.put("/stock", authenticateToken, verifyIfSeller, updateStock);
router.put("/meta", authenticateToken, verifyIfSeller, updateProductMeta);
router.delete("/:id", authenticateToken, verifyIfSeller, deleteProduct);

module.exports = router;