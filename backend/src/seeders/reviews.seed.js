const { Review, User, Product } = require("../models");

async function seedReviews() {
  // const users = await User.findAll();
  // const products = await Product.findAll();
  // if (!users.length || !products.length) return;

  // const count = await Review.count();
  // if (count > 0) return;

  // const data = [];

  // users.forEach((u, i) => {
  //   products.forEach((p, j) => {
  //     if ((i + j) % 2 === 0) {
  //       data.push({
  //         userId: u.id,
  //         productId: p.id,
  //         rating: 4,
  //         comment: "Good product"
  //       });
  //     }
  //   });
  // });

  // await Review.bulkCreate(data);
}

module.exports = seedReviews;
