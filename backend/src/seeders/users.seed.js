const bcrypt = require("bcryptjs");
const { User } = require("../models");

async function seedUsers() {
  const count = await User.count();
  if (count > 0) return;

  const password = await bcrypt.hash("1234", 10);

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
    },
    {
      name: "Yash",
      email: "ayash@gmail.com",
      password,
      role: "user",
      canSell: true
    },
    {
      name: "Khushwant",
      email: "khush@gmail.com",
      password,
      role: "user",
      canSell: true
    }
  ]);
}

module.exports = seedUsers;
