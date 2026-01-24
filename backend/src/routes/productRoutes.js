const express = require("express");
const router = express.Router();
const { addProduct, getProductById, getProducts } = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);

module.exports = router;