const { Cart, CartItem, Product } = require("../models");
const { Sequelize } = require("sequelize");

/* -------------------- Helpers -------------------- */

async function getOrCreateCart(userId) {
    const [cart] = await Cart.findOrCreate({
        where: { userId },
        defaults: { userId },
    });

    if (process.env.LOG !== "false") {
        console.log("Get Cart", userId);
    }

    return cart;
}

/* -------------------- Controllers -------------------- */

async function updateItemInCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Validation
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (typeof quantity !== "number") {
            return res.status(400).json({ message: "Quantity must be a number" });
        }

        // Product check
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Only ${product.stock} items are available in stock`,
            });
        }

        // Cart handling
        const cart = await getOrCreateCart(userId);

        const [cartItem, created] = await CartItem.findOrCreate({
            where: { cartId: cart.id, productId },
            defaults: { quantity },
        });

        // Update existing item
        if (!created) {
            cartItem.quantity += quantity;

            if (cartItem.quantity > product.stock) {
                cartItem.quantity = product.stock;
                await cartItem.save();
                return res.status(200).json({
                    message: `Only ${product.stock} items are available in stock. Cart updated to maximum available stock.`,
                    cartItem,
                });
            }

            if (cartItem.quantity <= 0) {
                await cartItem.destroy();
                return res.status(200).json({
                    message: "Item removed from cart",
                });
            }

            await cartItem.save();
        }
        // Created but invalid quantity
        else if (quantity <= 0) {
            await cartItem.destroy();
            return res.status(200).json({
                message: "Item not added to cart with non-positive quantity",
            });
        }

        if (process.env.LOG !== "false") {
            console.log("Item added to Cart");
        }

        return res.status(200).json({
            message: "Item added to cart successfully",
            cartItem,
        });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res
                .status(409)
                .json({ message: "Item already exists in cart" });
        }

        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function getCartItems(req, res) {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
        });

        if (!cartItems.length) {
            return res.status(200).json({
                message: "Cart is empty",
                items: [],
            });
        }

        return res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

/* -------------------- Exports -------------------- */

module.exports = {
    updateItemInCart,
    getCartItems,
};
