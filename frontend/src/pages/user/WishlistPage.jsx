import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { wishlistAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
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
            await wishlistAPI.toggle({ productId });
            setWishlist(wishlist.filter(item => item.productId !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddToCart = (productId) => {
        addToCart(productId);
    };

    return (
        <div className="page-container">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-8">
                    My <span className="gradient-text">Wishlist</span>
                </h1>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse h-80"></div>
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="glass-card text-center py-20">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400">Your wishlist is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((item, index) => (
                            <motion.div
                                key={item.productId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card"
                            >
                                <img
                                    src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}
                                    alt={item.Product?.name}
                                    className="w-full aspect-square object-cover rounded-xl mb-4"
                                />
                                <h3 className="font-semibold text-lg mb-2">{item.Product?.name}</h3>
                                <p className="text-2xl font-bold gradient-text mb-4">
                                    ${parseFloat(item.Product?.price).toFixed(2)}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item.productId)}
                                        className="flex-1 btn-primary"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="p-3 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
