const { Order, User, Address } = require("../models");

async function seedOrders() {
  const users = await User.findAll();
  const addresses = await Address.findAll();
  if (!users.length || !addresses.length) return;

  const count = await Order.count();
  if (count > 0) return;

  await Order.bulkCreate([
    {
      userId: users[0].id,
      totalAmount: 175000,
      status: "pending",
      paymentStatus: "pending",
      addressId: addresses[0].id
    },
    {
      userId: users[1].id,
      totalAmount: 25000,
      status: "shipped",
      paymentStatus: "success",
      addressId: addresses[1].id
    }
  ]);
}

module.exports = seedOrders;
