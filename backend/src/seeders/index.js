const seedUsers = require("./users.seed");
const seedProducts = require("./products.seed");
const seedAddresses = require("./addresses.seed");
const seedPhones = require("./phones.seed");

async function runSeeds() {
  await seedUsers();
  await seedProducts();
  await seedAddresses();
  await seedPhones();
}

module.exports = runSeeds;
