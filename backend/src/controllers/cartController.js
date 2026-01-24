const Cart = require("../models/Cart");
const CartItem = require("../models/CartItems");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });


async function getOrCreateCart(userId) {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId },
  });
  return cart;
}

async function addItemToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        if (!productId || quantity <= 0) {
            return res.status(400).json({ message: "Invalid product ID or quantity" });
        }

        const cart = await getOrCreateCart(userId);

        const [cartItem, created] = await CartItem.findOrCreate({
            where: { cartId: cart.id, productId },
            defaults: { quantity }
        });

        if (!created) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }
        if (process.env.LOG !== "false"){
            console.log("Item added to Cart")
        }
        return res.status(200).json({
            message: "Item added to cart successfully",
            cartItem
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}
async function getCartItems(req, res) {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
        return res.status(200).json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {
    addItemToCart,
    getCartItems
};

