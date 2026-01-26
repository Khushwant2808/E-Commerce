const { OrderItem, Order, Product } = require("../models");

async function seedOrderItems() {
  const orders = await Order.findAll();
  const products = await Product.findAll();
  if (!orders.length || !products.length) return;

  const count = await OrderItem.count();
  if (count > 0) return;

  const data = [];

  orders.forEach(order => {
    products.slice(0, 2).forEach(p => {
      data.push({
        orderId: order.id,
        productId: p.id,
        quantity: 1,
        price: p.price,
        status: "pending"
      });
    });
  });

  await OrderItem.bulkCreate(data);
}

module.exports = seedOrderItems;
