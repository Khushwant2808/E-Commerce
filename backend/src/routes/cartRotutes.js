const express = require("express");
const router = express.Router();
const {addItemToCart,getCartItems} = require("../controllers/cartController");

router.get("/:id", getCartItems);
router.post("/add", addItemToCart);


module.exports = router;