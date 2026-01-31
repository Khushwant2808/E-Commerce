import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { productAPI, reviewAPI } from '../../services/api'; // Fix import path
import toast from 'react-hot-toast';

const AddReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productAPI.getById(id);
                setProduct(data);
            } catch (error) {
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await reviewAPI.create({
                productId: id,
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            navigate(`/product/${id}`);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to submit review';
            if (msg === 'Product not purchased') {
                toast.error('You can only review products you have purchased.');
            } else if (msg === 'Review already exists') {
                toast.error('You have already reviewed this product.');
            } else {
                toast.error(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="glass-card animate-pulse h-96 m-8"></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="btn-ghost flex items-center space-x-2 mb-8 hover:-translate-x-1 transition-transform"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Product Preview Side */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 text-center"
                >
                    <h2 className="text-xl font-bold mb-4 text-gray-300">Rate this product</h2>
                    <img
                        src={product?.imageUrl}
                        alt={product?.name}
                        className="w-64 h-64 mx-auto object-cover rounded-xl shadow-lg mb-6"
                    />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {product?.name}
                    </h1>
                    <p className="text-gray-400 mt-2 line-clamp-3">{product?.description}</p>
                </motion.div>

                {/* Review Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <h2 className="text-2xl font-bold mb-6">Write a <span className="gradient-text">Review</span></h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* Rating Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Overall Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors duration-200 ${star <= (hoverRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-lg font-medium text-yellow-400">
                                    {(hoverRating || rating) > 0 ? (hoverRating || rating) + '/5' : ''}
                                </span>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={6}
                                className="input-field w-full resize-none bg-white/5 focus:bg-white/10 transition-colors"
                                placeholder="What did you like or dislike? How was the quality?"
                                required
                            />
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200">
                                Honest reviews help other customers make better decisions.
                                Reviews are only allowed for verified purchases.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full btn-primary py-3 flex items-center justify-center space-x-2 group"
                        >
                            {submitting ? (
                                <span>Submitting...</span>
                            ) : (
                                <>
                                    <span>Submit Review</span>
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddReviewPage;
