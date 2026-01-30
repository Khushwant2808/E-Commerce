import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield, TruckIcon } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data } = await productAPI.getAll({ limit: 8 });
            setFeaturedProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="section-container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm">Welcome to the Future of Shopping</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                                <span className="gradient-text">Elevate</span>
                                <br />
                                Your Lifestyle
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                                Discover premium products curated just for you. Experience luxury, quality, and style in every purchase.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/products" className="btn-primary group text-lg">
                                    Explore Collection
                                    <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/products?sort=price" className="btn-secondary text-lg">
                                    View Deals
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="section-container py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Zap}
                        title="Lightning Fast Delivery"
                        description="Get your orders delivered within 24 hours"
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Secure Payments"
                        description="Shop with confidence using encrypted transactions"
                    />
                    <FeatureCard
                        icon={TruckIcon}
                        title="Free Shipping"
                        description="Free shipping on all orders over $50"
                    />
                </div>
            </section>

            <section className="section-container py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
                            <p className="text-gray-400">Handpicked items just for you</p>
                        </div>
                        <Link to="/products" className="btn-secondary">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="glass-card animate-pulse">
                                    <div className="w-full aspect-square bg-white/5 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-white/5 rounded mb-2"></div>
                                    <div className="h-4 bg-white/5 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>

            <section className="section-container py-20">
                <div className="glass-card p-12 text-center hero-gradient">
                    <h2 className="text-4xl font-bold mb-4">Start Selling Today</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Join thousands of sellers and turn your passion into profit
                    </p>
                    <Link to="/profile" className="btn-primary text-lg">
                        Become a Seller
                    </Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="glass-card text-center group cursor-pointer"
    >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
            <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </motion.div>
);

export default HomePage;
