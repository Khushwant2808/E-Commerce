import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, incrementItem, decrementItem, totalPrice, loading } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card h-32"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="glass-card text-center py-20">
                        <ShoppingBag className="w-20 h-20 mx-auto mb-4 text-gray-600" />
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Add some products to get started</p>
                        <Link to="/products" className="btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-8">
                    Shopping <span className="gradient-text">Cart</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card flex gap-6"
                            >
                                <img
                                    src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                                    alt={item.Product?.name}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />

                                <div className="flex-1">
                                    <Link to={`/products/${item.productId}`} className="font-semibold text-lg hover:text-purple-400 transition-colors">
                                        {item.Product?.name}
                                    </Link>
                                    <p className="text-gray-400 text-sm mt-1">
                                        ${parseFloat(item.Product?.price || 0).toFixed(2)} each
                                    </p>

                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => decrementItem(item.productId)}
                                                className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-white/10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => incrementItem(item.productId)}
                                                className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-white/10"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors ml-auto"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-bold gradient-text">
                                        ${(parseFloat(item.Product?.price || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn-primary flex items-center justify-center space-x-2"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <Link
                                to="/products"
                                className="block text-center mt-4 text-gray-400 hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
