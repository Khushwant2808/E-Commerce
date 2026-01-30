import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const ProductCard = ({ product, isWishlisted: initialWishlisted = false, onWishlistToggle }) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
    const [isToggling, setIsToggling] = useState(false);

    // Sync with parent's wishlist state
    useEffect(() => {
        setIsWishlisted(initialWishlisted);
    }, [initialWishlisted]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product.id);
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            return;
        }

        if (isToggling) return;

        setIsToggling(true);
        try {
            if (isWishlisted) {
                await wishlistAPI.remove(product.id);
            } else {
                await wishlistAPI.toggle({ productId: product.id });
            }

            const newState = !isWishlisted;
            setIsWishlisted(newState);

            if (onWishlistToggle) {
                onWishlistToggle(product.id, newState);
            }

            toast.success(newState ? 'Added to wishlist' : 'Removed from wishlist');
        } catch (error) {
            console.error('[Wishlist] Toggle error:', error);
            if (error.response?.status === 409) {
                setIsWishlisted(true);
                if (onWishlistToggle) onWishlistToggle(product.id, true);
                toast.success('Already in wishlist');
            } else if (error.response?.status === 404 && isWishlisted) {
                setIsWishlisted(false);
                if (onWishlistToggle) onWishlistToggle(product.id, false);
                toast.error('Item was not in your wishlist');
            } else {
                toast.error('Failed to update wishlist');
            }
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <Link to={`/products/${product.id}`}>
            <motion.div
                whileHover={{ y: -8 }}
                className="card-product group h-full flex flex-col"
            >
                <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                        alt={product.name}
                        className="card-product-image"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                            onClick={toggleWishlist}
                            disabled={isToggling}
                            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted
                                ? 'bg-red-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                } ${isToggling ? 'opacity-50' : ''}`}
                        >
                            <Heart
                                className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-white scale-110' : ''
                                    }`}
                            />
                        </button>
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute top-3 left-3">
                            <span className="badge-warning">Only {product.stock} left</span>
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="badge-error text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

                    {product.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">
                            ({product.ratingCount || 0})
                        </span>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold gradient-text">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full btn-primary flex items-center justify-center space-x-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
