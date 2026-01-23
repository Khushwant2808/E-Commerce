const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItems");

/* ========= ASSOCIATIONS ========= */

// User ↔ Cart (1:1)
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart ↔ CartItem (1:N)
Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

// Product ↔ CartItem (1:N)
Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

/* ================================ */

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
};
