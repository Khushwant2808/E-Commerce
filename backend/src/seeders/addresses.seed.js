const { Address, User } = require("../models");

async function seedAddresses() {
  const users = await User.findAll();
  if (!users.length) return;

  const count = await Address.count();
  if (count > 0) return;

  await Address.bulkCreate(users.map(u => ({
    userId: u.id,
    line1: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India"
  })));
}

module.exports = seedAddresses;