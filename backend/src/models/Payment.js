const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gateway: {
    type: DataTypes.STRING
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
    defaultValue: "pending"
  },
  method: {
    type: DataTypes.ENUM("cod", "online"),
    defaultValue: "online"
  },
  transactionId: {
    type: DataTypes.STRING
  },
  rawResponse: {
    type: DataTypes.JSONB
  }
}, {
  tableName: "payments",
  timestamps: true
});

module.exports = Payment;
