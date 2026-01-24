const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  userId: { type: DataTypes.INTEGER, allowNull: false },
  line1: { type: DataTypes.STRING, allowNull: false },
  line2: DataTypes.STRING,
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  pincode: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, defaultValue: "India" },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "addresses",
  timestamps: true,
});

module.exports = Address;
