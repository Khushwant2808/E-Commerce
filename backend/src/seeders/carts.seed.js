const { Cart, User } = require("../models");

async function seedCarts() {
  const users = await User.findAll();
  if (!users.length) return;

  const count = await Cart.count();
  if (count > 0) return;

  await Cart.bulkCreate(
    users.map(u => ({
      userId: u.id
    }))
  );
}

module.exports = seedCarts;
