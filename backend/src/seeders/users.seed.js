const bcrypt = require("bcryptjs");
const { User } = require("../models");

async function seedUsers() {
  const count = await User.count();
  if (count > 0) return;

  const password = await bcrypt.hash("admin123", 10);

  await User.bulkCreate([
    {
      name: "Admin",
      email: "admin@admin.com",
      password,
      role: "admin",
      canSell: true
    },
    {
      name: "User One",
      email: "user1@test.com",
      password,
      role: "user",
      canSell: false
    }
  ]);
}

module.exports = seedUsers;
