const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SupportMessage = sequelize.define(
    "SupportMessage",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("pending", "resolved", "closed"),
            defaultValue: "pending"
        }
    },
    {
        tableName: "support_messages",
        timestamps: true
    }
);

module.exports = SupportMessage;
