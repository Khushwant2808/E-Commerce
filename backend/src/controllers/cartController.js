const { Cart, CartItem, Product } = require("../models");
const { Sequelize } = require("sequelize");

async function getOrCreateCart(userId) {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId }
  });

  if (process.env.LOG !== "false") {
    console.log("Get Cart", userId);
  }

  return cart;
}

async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items are available in stock`
      });
    }

    const cart = await getOrCreateCart(userId);

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId },
      defaults: { quantity }
    });

    if (!created) {
      // Check total quantity after addition
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        // Option: Cap at max stock or throw error? 
        // Current logic: Cap at max stock.
        cartItem.quantity = product.stock;
        await cartItem.save();
        return res.status(200).json({
          message: `Only ${product.stock} items are available in stock. Cart updated to maximum available stock.`,
          cartItem
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    }

    return res.status(200).json({
      message: "Item added to cart successfully",
      cartItem
    });
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    next(error);
  }
}

async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cartItem.destroy();

    return res.status(200).json({
      message: "Item removed from cart successfully"
    });
  } catch (error) {
    console.error("Remove from Cart Error:", error.message);
    next(error);
  }
}

async function incrementCartItem(req, res, next) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Product.findByPk(productId);

    if (cartItem.quantity + 1 > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items are available in stock`
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    return res.status(200).json({
      message: "Item quantity incremented",
      cartItem
    });
  } catch (error) {
    console.error("Increment Cart Item Error:", error.message);
    next(error);
  }
}

async function decrementCartItem(req, res, next) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (cartItem.quantity - 1 <= 0) {
      await cartItem.destroy();
      return res.status(200).json({
        message: "Item removed from cart"
      });
    }

    cartItem.quantity -= 1;
    await cartItem.save();

    return res.status(200).json({
      message: "Item quantity decremented",
      cartItem
    });
  } catch (error) {
    console.error("Decrement Cart Item Error:", error.message);
    next(error);
  }
}

async function getCartItems(req, res, next) {
  try {
    const userId = req.user.id;
    console.log('[Cart] Fetching cart for user:', userId);

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      console.log('[Cart] No cart found, returning empty');
      return res.status(200).json([]);
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          association: 'Product',
          attributes: ['id', 'name', 'price', 'imageUrl', 'stock', 'isActive']
        }
      ]
    });

    console.log('[Cart] Found', cartItems.length, 'items');

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('[Cart] Error fetching cart:', error.message);
    next(error);
  }
}



module.exports = {
  addToCart,
  removeFromCart,
  incrementCartItem,
  decrementCartItem,
  getCartItems
};
