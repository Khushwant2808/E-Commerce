const { Wishlist } = require("../models");
const { Sequelize } = require("sequelize");

async function addToWishList(req, res) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    const wish = await Wishlist.create({
      userId,
      productId
    });

    if (process.env.LOG === "true") {
      console.log("Wish added to wishlist");
    }

    return res.status(201).json({
      message: "Item added to wishlist successfully",
      wish
    });

  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ message: "Item already in wishlist" });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getWishlist(req, res) {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId }
    });

    if (!wishlist.length) {
      return res.status(404).json({ message: "Wishlist is empty" });
    }

    return res.status(200).json(wishlist);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addToWishList,
  getWishlist
};
