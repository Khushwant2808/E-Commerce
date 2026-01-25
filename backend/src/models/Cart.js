const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // 🚀 enforces ONE cart per user
  },
}, {
  tableName: "carts",
  timestamps: true,
  paranoid: true
});


module.exports = Cart;