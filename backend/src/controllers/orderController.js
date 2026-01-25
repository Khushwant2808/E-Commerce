const { map } = require("../app");
const {Cart , CartItem , Order , OrderItem , Product, Address , PhoneNumber}= require("../models");
const { Sequelize } = require("sequelize");

async function getOrderdetails(req,res) {
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

// async function placeOrder(req, res) {
//     // Implementation for placing an order
//     // try{
//     //     const userId = req.user.id;
//     //     // Further logic to create an order from the user's cart

//     // }
// }

module.exports = {getOrderdetails, placeOrder};