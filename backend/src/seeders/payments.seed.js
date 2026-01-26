const { Payment, Order } = require("../models");

async function seedPayments() {
  const orders = await Order.findAll();
  if (!orders.length) return;

  const count = await Payment.count();
  if (count > 0) return;

  await Payment.bulkCreate(
    orders.map(o => ({
      orderId: o.id,
      gateway: "mock",
      amount: o.totalAmount,
      status: o.paymentStatus === "paid" ? "success" : "pending",
      transactionId: `TXN_${Date.now()}_${o.id}`
    }))
  );
}

module.exports = seedPayments;
