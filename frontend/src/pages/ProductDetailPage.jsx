import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Package, Shield, TruckIcon } from 'lucide-react';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await productAPI.getById(id);
            setProduct(data);
        } catch (error) {
            console.error('Failed to fetch product:', error);
            toast.error('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await reviewAPI.getByProduct(id);
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleAddToCart = () => {
        addToCart(product.id, quantity);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
                        <div className="aspect-square bg-white/5 rounded-2xl"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-white/5 rounded w-3/4"></div>
                            <div className="h-4 bg-white/5 rounded w-1/2"></div>
                            <div className="h-32 bg-white/5 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-container">
                <div className="section-container text-center">
                    <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                    <Link to="/products" className="btn-primary">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="sticky top-24">
                            <img
                                src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                                alt={product.name}
                                className="w-full aspect-square object-cover rounded-2xl glass"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-400">
                                    {product.ratingCount || 0} reviews
                                </span>
                            </div>

                            <div className="text-5xl font-bold gradient-text mb-6">
                                ${parseFloat(product.price).toFixed(2)}
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {product.description || 'No description available'}
                            </p>

                            <div className="flex items-center gap-2 mb-8">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="badge-success">In Stock</span>
                                        {product.stock < 10 && (
                                            <span className="badge-warning">Only {product.stock} left!</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="badge-error">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        <div className="glass-card space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="text-gray-400">Quantity:</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="w-full btn-primary text-lg flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                <span>Add to Cart</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="glass-card text-center">
                                <TruckIcon className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                                <p className="text-sm text-gray-400">Fast Delivery</p>
                            </div>
                            <div className="glass-card text-center">
                                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                                <p className="text-sm text-gray-400">Secure Payment</p>
                            </div>
                            <div className="glass-card text-center">
                                <Package className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                <p className="text-sm text-gray-400">Easy Returns</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="glass-card">
                    <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 mb-2">{review.comment}</p>
                                    <p className="text-sm text-gray-400">
                                        — {review.userName || 'Anonymous'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
