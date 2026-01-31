const { Review, Order, OrderItem, Product } = require("../models");
const { Sequelize } = require("sequelize");

async function addReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: "Product and rating required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const orderItem = await OrderItem.findOne({
      include: [{
        model: Order,
        where: { userId }
      }],
      where: { productId }
    });

    if (!orderItem) {
      return res.status(403).json({ message: "Product not purchased" });
    }

    let review = await Review.findOne({ where: { userId, productId } });

    if (review) {
      return res.status(409).json({ message: "Review already exists" });
    }

    review = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    await recalcProductRating(productId);

    if (process.env.LOG !== "false") {
      console.log("Review added", userId, productId);
    }

    return res.status(201).json({
      message: "Review added",
      review
    });
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product required" });
    }

    const review = await Review.findOne({
      where: { userId, productId }
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    await recalcProductRating(productId);

    if (process.env.LOG !== "false") {
      console.log("Review updated", userId, productId);
    }

    return res.status(200).json({
      message: "Review updated",
      review
    });
  } catch (error) {
    next(error);
  }
}

async function getProductRating(req, res, next) {
  try {
    const { productId } = req.params;
    console.log('[Reviews] Fetching reviews for product:', productId);

    if (!productId) {
      return res.status(400).json({ message: "Product required" });
    }

    const product = await Product.findByPk(productId, {
      attributes: ["id", "name", "rating", "ratingCount"]
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.findAll({
      where: { productId },
      include: [
        {
          association: 'User',
          attributes: ['id', 'name']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    console.log('[Reviews] Found', reviews.length, 'reviews for product:', productId);

    return res.status(200).json({
      rating: product.rating,
      ratingCount: product.ratingCount,
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userName: review.User?.name || 'Anonymous',
        userId: review.userId,
        createdAt: review.createdAt
      }))
    });
  } catch (error) {
    console.error('[Reviews] Error fetching reviews:', error.message);
    next(error);
  }
}

async function recalcProductRating(productId) {
  const stats = await Review.findOne({
    where: { productId },
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("rating")), "avgRating"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
    ],
    raw: true
  });

  const avg = parseFloat(stats.avgRating || 0).toFixed(2);
  const count = parseInt(stats.count || 0);

  await Product.update(
    {
      rating: avg,
      ratingCount: count
    },
    { where: { id: productId } }
  );

  if (process.env.LOG !== "false") {
    console.log("Rating recalculated", productId, avg, count);
  }
}

module.exports = {
  addReview,
  updateReview,
  getProductRating
};
