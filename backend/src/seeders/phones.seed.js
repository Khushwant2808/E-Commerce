const { PhoneNumber, User } = require("../models");

async function seedPhones() {
  const users = await User.findAll();
  if (!users.length) return;

  const count = await PhoneNumber.count();
  if (count > 0) return;

  await PhoneNumber.bulkCreate(users.map((u, i) => ({
    userId: u.id,
    phone: `99999999${10 + i}`,
    isPrimary: true,
    isVerified: true
  })));
}

module.exports = seedPhones;
