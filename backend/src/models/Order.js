const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  userId: { type: DataTypes.INTEGER, allowNull: false },

  totalAmount: { type: DataTypes.DECIMAL(10,2), allowNull: false },

  status: {
    type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
    defaultValue: "pending"
  },


  addressId: { type: DataTypes.INTEGER, allowNull: false },

}, {
  tableName: "orders",
  timestamps: true,
  paranoid: true
});

module.exports = Order;
