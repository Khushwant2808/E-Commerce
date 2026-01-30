import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { addressAPI, orderAPI } from '../../services/api';
import { User, Store, Mail, Package, MapPin, Heart, Clock, ArrowRight, ChevronRight, ShieldCheck, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
    const { user, isSeller, becomeSeller } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ orders: 0, addresses: 0 });
    const [loading, setLoading] = useState(true);
    const [becomingSelller, setBecomingSeller] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [ordersRes, addressRes] = await Promise.all([
                orderAPI.getAll(),
                addressAPI.getAll()
            ]);
            setStats({
                orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0,
                addresses: Array.isArray(addressRes.data) ? addressRes.data.length : 0
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBecomeSeller = async () => {
        setBecomingSeller(true);
        try {
            const result = await becomeSeller();
            if (result.success) {
                navigate('/seller');
            }
        } finally {
            setBecomingSeller(false);
        }
    };

    const quickLinks = [
        { label: 'My Orders', icon: Package, path: '/orders', count: stats.orders },
        { label: 'Wishlist', icon: Heart, path: '/wishlist' },
        { label: 'Addresses', icon: MapPin, path: '/checkout', count: stats.addresses },
    ];

    return (
        <div className="page-container">
            <div className="section-container max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <User className="w-12 h-12" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
                                <Mail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${isSeller
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    <Store className="w-4 h-4 inline mr-2" />
                                    {isSeller ? 'Seller Account' : 'Customer Account'}
                                </span>
                                {user?.role === 'admin' && (
                                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                        <ShieldCheck className="w-4 h-4 inline mr-2" />
                                        Admin
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex flex-col gap-3">
                            {isSeller ? (
                                <button
                                    onClick={() => navigate('/seller')}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    Seller Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleBecomeSeller}
                                    disabled={becomingSelller}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    {becomingSelller ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Store className="w-5 h-5" />
                                            Become a Seller
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Orders', value: stats.orders, icon: Package, color: 'purple' },
                        { label: 'Saved Addresses', value: stats.addresses, icon: MapPin, color: 'blue' },
                        { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Clock, color: 'green' },
                        { label: 'Account Type', value: isSeller ? 'Seller' : 'Customer', icon: User, color: 'orange' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card text-center"
                        >
                            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                            </div>
                            <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {quickLinks.map((link, i) => (
                        <motion.button
                            key={link.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            onClick={() => navigate(link.path)}
                            className="glass-card flex items-center justify-between group hover:border-purple-500/50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                    <link.icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold">{link.label}</p>
                                    {link.count !== undefined && (
                                        <p className="text-gray-400 text-sm">{link.count} saved</p>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        </motion.button>
                    ))}
                </div>

                {/* Seller CTA (if not seller) */}
                {!isSeller && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative overflow-hidden rounded-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgY3g9IjIwIiBjeT0iMjAiIHI9IjIiLz48L2c+PC9zdmc+')] opacity-50" />

                        <div className="relative p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Store className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Start Selling Today!</h3>
                            <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                Join thousands of sellers on our platform. List your products, manage orders, and grow your business.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center mb-6">
                                {['No listing fees', 'Easy dashboard', 'Fast payments', 'Analytics'].map(feature => (
                                    <span key={feature} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                        ✓ {feature}
                                    </span>
                                ))}
                            </div>
                            <button onClick={handleBecomeSeller} disabled={becomingSelller} className="btn-primary text-lg px-8">
                                {becomingSelller ? 'Processing...' : 'Become a Seller Now'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Seller Dashboard Preview (if seller) */}
                {isSeller && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Seller Dashboard</h3>
                            <button onClick={() => navigate('/seller')} className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Dashboard', path: '/seller', icon: TrendingUp },
                                { label: 'Products', path: '/seller/products', icon: Package },
                                { label: 'Add Product', path: '/seller/products/add', icon: Store },
                                { label: 'Orders', path: '/seller/orders', icon: Package },
                            ].map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group"
                                >
                                    <item.icon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                    <p className="text-sm font-medium">{item.label}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
