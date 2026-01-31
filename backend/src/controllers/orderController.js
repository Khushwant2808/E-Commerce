const { Cart, CartItem, Order, OrderItem, Product, Payment, Address, User, PhoneNumber, sequelize } = require("../models");

async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;
    console.log('[Orders] Fetching orders for user:', userId);

    const orders = await Order.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'imageUrl']
            }
          ]
        },
        {
          model: Address,
          attributes: ['line1', 'city', 'state', 'pincode']
        }
      ]
    });

    console.log('[Orders] Found', orders.length, 'orders for user:', userId);

    // Return empty array instead of 404 for better UX
    return res.status(200).json(orders);
  } catch (error) {
    console.error('[Orders] Error fetching orders:', error.message);
    next(error);
  }
}

async function getSellerOrders(req, res, next) {
  try {
    const sellerId = req.user.id;
    console.log('[Orders] Fetching orders for seller:', sellerId);

    // 1. Get all products associated with this seller
    const products = await Product.findAll({
      where: { userId: sellerId },
      attributes: ['id']
    });

    const productIds = products.map(p => p.id);

    if (productIds.length === 0) {
      return res.status(200).json([]);
    }

    const { Op } = require("sequelize");

    // 2. Find orders containing these products
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          required: true, // Only returns orders that HAVE these items
          where: {
            productId: {
              [Op.in]: productIds
            }
          },
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'imageUrl']
            }
          ]
        },
        {
          model: User, // Buyer
          attributes: ['id', 'name', 'email']
        },
        {
          model: Address
        }
      ]
    });

    // 3. Calculate revenue for the seller per order
    const sellerOrders = orders.map(order => {
      const orderJson = order.toJSON();

      // Calculate total only for items sold by this seller
      const sellerTotal = orderJson.orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      return {
        ...orderJson,
        totalAmount: sellerTotal // Override totalAmount with seller's revenue
      };
    });

    console.log('[Orders] Found', sellerOrders.length, 'orders for seller:', sellerId);

    return res.status(200).json(sellerOrders);
  } catch (error) {
    console.error('[Orders] Error fetching seller orders:', error.message);
    next(error);
  }
}

async function placeOrder(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const address = await Address.findOne({
      where: { userId },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]]
    });

    if (!address) {
      await transaction.rollback();
      return res.status(400).json({ message: "No address found for this user" });
    }

    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Product] }]
    });

    if (!cart || !cart.CartItems.length) {
      await transaction.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    for (const item of cart.CartItems) {
      if (item.Product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ message: `Insufficient stock for ${item.Product.name}` });
      }
      totalAmount += item.quantity * item.Product.price;
    }

    const order = await Order.create(
      {
        userId,
        totalAmount,
        addressId: address.id,
        status: "pending",
        paymentStatus: "pending"
      },
      { transaction }
    );

    for (const item of cart.CartItems) {
      const product = item.Product;
      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          status: "pending"
        },
        { transaction }
      );

      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction
    });

    await transaction.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.id,
      totalAmount
    });
  } catch (error) {
    await transaction.rollback();
    if (next) next(error);
    else res.status(500).json({ message: "Failed to place order" });
  }
}

async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [Product]
        },
        {
          model: Address
        },
        {
          model: User,
          include: [{ model: PhoneNumber, as: 'PhoneNumber' }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Format for frontend
    const orderData = order.toJSON();
    if (order.Address) {
      orderData.shippingAddress = `${order.Address.line1}${order.Address.line2 ? ', ' + order.Address.line2 : ''}, ${order.Address.city}, ${order.Address.state} - ${order.Address.pincode}`;
    }

    const userPhone = order.User?.PhoneNumber?.phone || order.User?.Number?.phone;
    if (userPhone) {
      orderData.phoneNumber = userPhone;
    }

    return res.status(200).json(orderData);
  } catch (error) {
    next(error);
  }
}

async function updateOrderItemStatus(req, res, next) {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "shipped", "delivered", "cancelled", "returned"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const orderItem = await OrderItem.findByPk(itemId);
    if (!orderItem) return res.status(404).json({ message: "Order Item not found" });

    if (status === "delivered") {
      const order = await Order.findByPk(orderItem.orderId);

      if (order.paymentStatus === "failed") {
        return res.status(400).json({ message: "Cannot deliver. Payment has failed." });
      }

      if (order.paymentStatus !== "paid") {
        const lastPayment = await Payment.findOne({
          where: { orderId: order.id },
          order: [["createdAt", "DESC"]]
        });

        if (!lastPayment || lastPayment.method === "online") {
          return res.status(400).json({
            message: "Cannot mark delivered. Order is not paid (Online Pending)."
          });
        }
      }
    }

    orderItem.status = status;
    await orderItem.save();

    const allItems = await OrderItem.findAll({ where: { orderId: orderItem.orderId } });
    const allComplete = allItems.every(item =>
      ["shipped", "delivered", "cancelled", "returned"].includes(item.status)
    );

    if (allComplete) {
      let newStatus = "shipped";
      if (status === "delivered") newStatus = "delivered";
      if (status === "cancelled") newStatus = "cancelled";

      await Order.update({ status: newStatus }, { where: { id: orderItem.orderId } });
    }

    return res.status(200).json({ message: "Item status updated", orderItem });
  } catch (error) {
    next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findOne({ where: { id, userId } });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") return res.status(400).json({ message: "Order cannot be cancelled" });

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  placeOrder,
  getOrderById,
  cancelOrder,
  getMyOrders,
  updateOrderStatus,
  updateOrderItemStatus,
  getSellerOrders
};