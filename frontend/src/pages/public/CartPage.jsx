import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="p-6 bg-neutral-800 rounded-full mb-4">
                    <ShoppingBag className="w-12 h-12 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                <p className="text-neutral-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/products" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="glass p-4 rounded-xl flex items-center space-x-4"
                        >
                            <div className="w-20 h-20 bg-neutral-800 rounded-lg flex-shrink-0" />
                            {/* <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-neutral-800" /> */}

                            <div className="flex-1">
                                <h3 className="text-white font-medium">{item.name}</h3>
                                <p className="text-neutral-400 text-sm">${item.price}</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
                                >
                                    -
                                </button>
                                <span className="text-white w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-neutral-500 hover:text-red-400 p-2"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}

                    <button onClick={clearCart} className="text-sm text-red-400 hover:underline mt-4">
                        Clear Cart
                    </button>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="glass p-6 rounded-xl sticky top-24">
                        <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex justify-between text-neutral-300">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-300">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-4 mb-6">
                            <div className="flex justify-between text-white font-bold">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full btn-primary flex items-center justify-center">
                            Checkout <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
