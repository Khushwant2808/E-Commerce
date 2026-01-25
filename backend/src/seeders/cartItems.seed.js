const { Cart, CartItem, Product } = require("../models");

async function seedCartItems() {
  const carts = await Cart.findAll();
  const products = await Product.findAll();
  if (!carts.length || !products.length) return;

  const count = await CartItem.count();
  if (count > 0) return;

  const data = [];

  carts.forEach(cart => {
    products.slice(0, 2).forEach(p => {
      data.push({
        cartId: cart.id,
        productId: p.id,
        quantity: 1
      });
    });
  });

  await CartItem.bulkCreate(data);
}

module.exports = seedCartItems;
