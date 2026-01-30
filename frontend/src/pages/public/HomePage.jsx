import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-neutral-900">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 text-center max-w-4xl px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 mb-6"
                    >
                        Redefine Your Style.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                    >
                        Discover a curated collection of premium products designed for the modern minimalists.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/products" className="btn-primary w-full sm:w-auto px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center">
                            Shop Collection <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        <Link to="/about" className="px-8 py-3 rounded-full border border-neutral-700 text-white font-semibold hover:bg-neutral-800 transition-colors w-full sm:w-auto">
                            Our Story
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-24 px-4 bg-neutral-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Trending Now</h2>
                            <p className="text-neutral-400">Handpicked items just for you</p>
                        </div>
                        <Link to="/products" className="text-neutral-400 hover:text-white flex items-center transition-colors">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: item * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-card overflow-hidden group cursor-pointer"
                            >
                                <div className="aspect-square bg-neutral-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-neutral-700/50 animate-pulse" />
                                    {/* Image Placeholder */}
                                    {/* <img src="..." className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-medium">Premium Product {item}</h3>
                                        <div className="flex items-center text-yellow-500 text-xs">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="ml-1 text-neutral-400">4.8</span>
                                        </div>
                                    </div>
                                    <p className="text-neutral-500 text-sm mb-3">Minimalist Design</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-semibold">$129.00</span>
                                        <button className="text-xs font-medium text-white bg-neutral-700 px-3 py-1 rounded-full hover:bg-white hover:text-black transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
