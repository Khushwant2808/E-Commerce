const { Wishlist } = require("../models");
const { Sequelize } = require("sequelize");

async function addToWishList(req, res, next) {
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
    console.error("Wishlist Error:", error.message);

    if (error instanceof Sequelize.UniqueConstraintError) {
      return res.status(409).json({ message: "Item already in wishlist" });
    }

    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      console.error("Foreign key constraint error - User may not exist");
      return res.status(400).json({
        message: "Unable to add item to wishlist. Please try logging in again."
      });
    }

    next(error);
  }
}

async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          association: 'Product',
          attributes: ['id', 'name', 'price', 'imageUrl', 'stock', 'isActive']
        }
      ]
    });

    return res.status(200).json({
      items: wishlist,
      count: wishlist.length
    });
  } catch (error) {
    next(error);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const deleted = await Wishlist.destroy({
      where: { userId, productId: Number(productId) }
    });

    if (!deleted) {
      const exists = await Wishlist.findOne({ where: { userId, productId } });
      if (!exists) {
        return res.status(404).json({ message: 'Item not in wishlist' });
      }
    }

    if (process.env.LOG === 'true') {
      console.log(`[Wishlist] User ${userId} removed product ${productId}`);
    }
    return res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addToWishList,
  getWishlist,
  removeFromWishlist
};
