const { Order, Payment, sequelize } = require("../models");

// 1. Initialize (or Retry) Payment
async function initializePayment(req, res, next) {
    try {
        const { orderId, method } = req.body; // method: 'online' or 'cod'
        const userId = req.user.id;

        const order = await Order.findOne({ where: { id: orderId, userId } });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.paymentStatus === "paid") {
            return res.status(400).json({ message: "Order is already paid" });
        }

        // SCENARIO: COD
        if (method === "cod") {
            await Payment.create({
                orderId: order.id,
                amount: order.totalAmount,
                method: "cod",
                status: "pending",
                transactionId: `COD-${Date.now()}`
            });
            return res.status(200).json({ message: "Order set to COD", order });
        }

        // SCENARIO: ONLINE
        const payment = await Payment.create({
            orderId: order.id,
            amount: order.totalAmount,
            method: "online",
            status: "pending",
            gateway: "stripe_mock" 
        });

        // Simulate Session ID (Replace with real Stripe Logic)
        const sessionId = `sess_${Date.now()}_${payment.id}`;
        payment.transactionId = sessionId;
        await payment.save();

        return res.status(200).json({
            message: "Payment initialized",
            paymentId: payment.id,
            sessionId: sessionId
        });

    } catch (error) {
        next(error);
    }
}

// 2. Verify Payment (Webhook/Success Page)
async function verifyPayment(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
        const { paymentId, status } = req.body; // 'success' or 'failed'
        
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ message: "Payment not found" });
        }

        payment.status = status;
        await payment.save({ transaction });

        const order = await Order.findByPk(payment.orderId);

        if (status === "success") {
            order.paymentStatus = "paid";
            await order.save({ transaction });
        } else if (status === "failed") {
            order.paymentStatus = "failed"; // Marks order as failed (allows retry)
            await order.save({ transaction });
        }

        await transaction.commit();
        return res.status(200).json({ 
            message: `Payment updated to ${status}`, 
            orderPaymentStatus: order.paymentStatus 
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

async function getOrderHistory(req, res, next) {
    try {
        const { orderId } = req.params;
        const payments = await Payment.findAll({ 
            where: { orderId },
            order: [["createdAt", "DESC"]]
        });
        return res.status(200).json(payments);
    } catch(err) {
        next(err);
    }
}

module.exports = { initializePayment, verifyPayment, getOrderHistory };