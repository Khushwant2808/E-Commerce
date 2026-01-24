const seedUsers = require("./users.seed");
const seedProducts = require("./products.seed");
const seedAddresses = require("./addresses.seed");
const seedPhones = require("./phones.seed");
const seedCarts = require("./carts.seed");
const seedCartItems = require("./cartItems.seed");
const seedOrders = require("./orders.seed");
const seedOrderItems = require("./orderItems.seed");
const seedPayments = require("./payments.seed");
const seedReviews = require("./reviews.seed");

async function runSeeds() {
  await seedUsers();
  await seedProducts();
  await seedAddresses();
  await seedPhones();
  await seedCarts();
  await seedCartItems();
  await seedOrders();
  await seedOrderItems();
  await seedPayments();
  await seedReviews();
}

module.exports = runSeeds;
