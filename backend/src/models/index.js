const sequelize = require("../config/database");

const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const CartItem = require("./CartItems");
const PhoneNumber = require("./PhoneNumber");
const Address = require("./Address");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const Review = require("./Review");
const Wishlist = require("./Wishlist");

User.hasOne(PhoneNumber, { foreignKey: "userId", onDelete: "CASCADE" });
PhoneNumber.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { as: "orderItems", foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Order.hasMany(Payment, { foreignKey: "orderId", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

Address.hasMany(Order, { foreignKey: "addressId", onDelete: "CASCADE" });
Order.belongsTo(Address, { foreignKey: "addressId" });

User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

Product.hasMany(Review, { foreignKey: "productId", onDelete: "CASCADE" });
Review.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Wishlist, { foreignKey: "userId", onDelete: "CASCADE" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Wishlist, { foreignKey: "productId", onDelete: "CASCADE" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
  PhoneNumber,
  Address,
  Order,
  OrderItem,
  Payment,
  Review,
  Wishlist
};
