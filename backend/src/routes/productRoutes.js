const express = require("express");
const router = express.Router();

const { getProducts, updateStock, updateProductMeta, addProduct, showProducts } = require("../controllers/productController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { verifyIfSeller } = require("../middlewares/productMiddleware");

router.get("/", getProducts);
router.post("/", authenticateToken, verifyIfSeller, addProduct);
router.put("/stock", authenticateToken, verifyIfSeller, updateStock);
router.put("/meta", authenticateToken, verifyIfSeller, updateProductMeta);
router.get("/show",authenticateToken, verifyIfSeller, showProducts)

module.exports = router;