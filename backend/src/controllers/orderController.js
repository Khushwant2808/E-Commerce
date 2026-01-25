const { Cart, CartItem, Order, OrderItem, Product, Address, PhoneNumber, sequelize } = require("../models");

async function getMyOrders(req, res) {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    as: "orderItems",
                },
            ],
        });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function placeOrder(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;

        /* -------------------- Fetch Address -------------------- */

        const address = await Address.findOne({
            where: { userId },
            order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
        });

        if (!address) {
            return res.status(400).json({
                message: "No address found for this user",
            });
        }

        /* -------------------- Fetch Phone Number -------------------- */

        const phone = await PhoneNumber.findOne({
            where: { userId },
        });

        if (!phone) {
            return res.status(400).json({
                message: "No phone number found for this user",
            });
        }

        /* -------------------- Fetch Cart -------------------- */

        const cart = await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        });

        if (!cart || !cart.CartItems.length) {
            return res.status(400).json({
                message: "Cart is empty",
            });
        }

        /* -------------------- Stock & Total -------------------- */

        let totalAmount = 0;

        for (const item of cart.CartItems) {
            const product = item.Product;

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            totalAmount += item.quantity * product.price;
        }

        /* -------------------- Create Order -------------------- */

        const order = await Order.create(
            {
                userId,
                totalAmount,
                addressId: address.id,
                status: "pending",
                paymentStatus: "pending",
            },
            { transaction }
        );

        /* -------------------- Order Items & Stock Update -------------------- */

        for (const item of cart.CartItems) {
            const product = item.Product;

            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price,
                },
                { transaction }
            );

            product.stock -= item.quantity;
            await product.save({ transaction });
        }

        /* -------------------- Clear Cart -------------------- */

        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction,
        });

        await transaction.commit();

        return res.status(201).json({
            message: "Order placed successfully",
            orderId: order.id,
            totalAmount,
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);

        return res.status(500).json({
            message: "Failed to place order",
        });
    }
}



async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({
            where: { id, userId },
            include: [OrderItem]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function cancelOrder(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ where: { id, userId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Order cannot be cancelled" });
        }

        order.status = "cancelled";
        await order.save();

        return res.status(200).json({
            message: "Order cancelled",
            order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}


async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ["pending", "shipped", "delivered", "cancelled"];

        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    placeOrder,
    getOrderById,
    cancelOrder,
    getMyOrders,
    updateOrderStatus
}