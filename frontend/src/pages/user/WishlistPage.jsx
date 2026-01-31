import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const { data } = await wishlistAPI.get();
            setWishlist(data.items || []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            setWishlist(prev => prev.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (productId) => {
        addToCart(productId);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <h1 className="text-4xl font-bold mb-8">
                        My <span className="gradient-text">Wishlist</span>
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse h-[400px]"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        My <span className="gradient-text">Wishlist</span>
                    </h1>
                    <span className="text-gray-400 font-medium">{wishlist.length} Items</span>
                </div>

                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card text-center py-20 max-w-2xl mx-auto"
                    >
                        <Heart className="w-24 h-24 mx-auto mb-6 text-gray-700" />
                        <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-8">Explore our exclusive collection and save your favorites here.</p>
                        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                            Start Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence>
                            {wishlist.map((item) => (
                                <motion.div
                                    layout
                                    key={item.productId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                                    whileHover={{ y: -8 }}
                                    className="glass-card p-0 overflow-hidden group relative"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                                            alt={item.Product?.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Remove Button (Heart) */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemove(item.productId);
                                            }}
                                            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-red-500 hover:text-white text-red-500 transition-all duration-300 shadow-lg group-hover:scale-110"
                                            title="Remove from wishlist"
                                        >
                                            <Heart className="w-5 h-5 fill-current" />
                                        </button>

                                        {/* Quick Add to Cart Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(item.productId);
                                            }}
                                            className="absolute bottom-4 right-4 p-3 rounded-full bg-blue-500 text-white shadow-lg translate-y-16 group-hover:translate-y-0 transition-transform duration-300 hover:bg-blue-600"
                                            title="Add to Cart"
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <Link to={`/products/${item.productId}`}>
                                            <h3 className="font-bold text-lg mb-1 truncate group-hover:text-blue-400 transition-colors">
                                                {item.Product?.name}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xl font-bold text-white">
                                                ${parseFloat(item.Product?.price).toFixed(2)}
                                            </p>
                                            {item.Product?.stock > 0 ? (
                                                <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
