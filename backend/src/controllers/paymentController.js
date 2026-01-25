const {Payment , Order} = require('../models');
const sequelize = require("sequelize");

async function getPaymentsByOrderId(req, res, next) {
    try {
        const orderId = req.body.orderId;

        const payments = await Payment.findAll({
            where: { orderId },
            order: [["createdAt", "DESC"]],
        });

        if (!payments.length) {
            return res.status(404).json({ message: "No payments found for this order" });
        }

        return res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
}

async function createPayment(req , res , next) {
    
}

