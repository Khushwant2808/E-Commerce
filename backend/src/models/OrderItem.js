const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled", "returned"),
      defaultValue: "pending"
    }
  },
  {
    tableName: "order_items",
    timestamps: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ["orderId", "productId"] }]
  }
);

module.exports = OrderItem;