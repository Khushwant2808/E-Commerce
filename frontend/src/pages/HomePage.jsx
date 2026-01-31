import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield, Truck, Star, ChevronRight, Play, Award, Users, Globe } from 'lucide-react';
import { productAPI, wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const { isAuthenticated, isSeller } = useAuth();

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistIds(new Set());
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            const { data } = await wishlistAPI.get();
            const ids = new Set((data.items || []).map(item => Number(item.productId)));
            setWishlistIds(ids);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        }
    };

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

    const handleWishlistToggle = (productId, isNowWishlisted) => {
        setWishlistIds(prev => {
            const newSet = new Set(prev);
            isNowWishlisted ? newSet.add(productId) : newSet.delete(productId);
            return newSet;
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
    };

    return (
        <div className="overflow-hidden">
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

                <div className="section-container relative z-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div variants={itemVariants} className="mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm font-medium text-purple-300">
                                <Sparkles className="w-4 h-4" />
                                The Future of E-Commerce is Here
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight"
                        >
                            Discover
                            <br />
                            <span className="gradient-text">Premium</span> Products
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            Experience luxury shopping with curated collections, seamless checkout, and lightning-fast delivery. Your perfect purchase awaits.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link to="/products" className="btn-primary group flex items-center gap-2 text-lg px-8 py-4">
                                Start Shopping
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                            <Link to="/about" className="btn-secondary flex items-center gap-2 px-8 py-4">
                                <Play className="w-5 h-5" />
                                Watch Demo
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                        >
                            <StatItem value="50K+" label="Happy Customers" />
                            <StatItem value="10K+" label="Products" />
                            <StatItem value="99%" label="Satisfaction" />
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
                        <motion.div
                            animate={{ y: [0, 16, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-white/50 rounded-full mx-auto"
                        />
                    </div>
                </motion.div>
            </motion.section>

            <section className="py-20 relative">
                <div className="section-container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <FeatureCard
                            icon={Zap}
                            title="Lightning Fast"
                            description="Same-day delivery available in select cities. Get your orders within hours."
                            gradient="from-yellow-500 to-orange-500"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Secure Payments"
                            description="Bank-grade encryption keeps your transactions safe and private."
                            gradient="from-green-500 to-emerald-500"
                        />
                        <FeatureCard
                            icon={Truck}
                            title="Free Shipping"
                            description="Enjoy free shipping on all orders over $50. No hidden fees."
                            gradient="from-blue-500 to-cyan-500"
                        />
                    </motion.div>
                </div>
            </section>

            <section className="py-20 relative">
                <div className="section-container">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                            <div>
                                <span className="text-purple-400 font-medium mb-2 block">CURATED FOR YOU</span>
                                <h2 className="text-4xl sm:text-5xl font-bold">Featured Products</h2>
                            </div>
                            <Link to="/products" className="group flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
                                View All Collection
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="glass-card animate-pulse">
                                        <div className="w-full aspect-square bg-white/5 rounded-xl mb-4" />
                                        <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                                        <div className="h-4 bg-white/5 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            isWishlisted={wishlistIds.has(Number(product.id))}
                                            onWishlistToggle={handleWishlistToggle}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />

                <div className="section-container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <span className="text-purple-400 font-medium mb-2 block">WHY LUXECOMMERCE</span>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">Trusted by Thousands</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Join our community of satisfied customers who have made LuxeCommerce their go-to destination for premium products.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TrustCard icon={Award} title="Quality Guaranteed" description="Every product is verified for authenticity and quality before reaching you." />
                        <TrustCard icon={Users} title="24/7 Support" description="Our dedicated support team is always ready to help you with any questions." />
                        <TrustCard icon={Globe} title="Global Shipping" description="We deliver to over 100 countries with fast and reliable shipping partners." />
                    </div>
                </div>
            </section>

            {!isSeller && (
                <section className="py-20">
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative overflow-hidden rounded-3xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-90" />
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

                            <div className="relative z-10 px-8 py-20 text-center">
                                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start Selling Today</h2>
                                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                                    Join thousands of successful sellers and turn your passion into profit. Zero setup fees.
                                </p>
                                <Link to={isAuthenticated ? "/contact" : "/register"} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 hover:scale-105">
                                    {isAuthenticated ? 'Contact Us to Sell' : 'Become a Seller'}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}
        </div>
    );
};

const StatItem = ({ value, label }) => (
    <div className="text-center">
        <div className="text-3xl sm:text-4xl font-bold gradient-text">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
    <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="glass-card group"
    >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
);

const TrustCard = ({ icon: Icon, title, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card text-center"
    >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </motion.div>
);

export default HomePage;
