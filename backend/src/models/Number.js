
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Number = sequelize.define(
  "Number",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },

    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    tableName: "phone_numbers",
    timestamps: true,
  }
);

module.exports = Number;
