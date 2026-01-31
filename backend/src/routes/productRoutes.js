const express = require("express");
const router = express.Router();

const { getProducts, getProductById, updateStock, updateProductMeta, addProduct, showProducts, deleteProduct } = require("../controllers/productController");
const { authenticateToken, optionalAuthenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

router.get("/", getProducts);
router.get("/show", authenticateToken, verifyIfSeller, showProducts);
router.get("/:id", optionalAuthenticateToken, getProductById); // Must be after /show to not match "show" as :id

router.post("/", authenticateToken, verifyIfSeller, addProduct);
router.put("/stock", authenticateToken, verifyIfSeller, updateStock);
router.put("/meta", authenticateToken, verifyIfSeller, updateProductMeta);
router.delete("/:id", authenticateToken, verifyIfSeller, deleteProduct);

module.exports = router;