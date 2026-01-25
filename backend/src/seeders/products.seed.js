const { Product } = require("../models");

async function seedProducts() {
  const count = await Product.count();
  if (count > 0) return;

  await Product.bulkCreate([
    {
      name: "iPhone 16",
      description: "Apple smartphone",
      price: 120000,
      stock: 15,
      isFeatured: true,
      userId: 3
    },
    {
      name: "MacBook Air M3",
      description: "Apple laptop",
      price: 150000,
      stock: 8,
      userId: 3
    },
    {
      name: "AirPods Pro",
      description: "Wireless earbuds",
      price: 25000,
      stock: 30,
      userId: 3
    }
  ]);
}

module.exports = seedProducts;
