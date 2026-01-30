import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { productAPI, orderAPI } from '../../services/api';

const SellerDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        activeProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                productAPI.getMyProducts(),
                orderAPI.getAll(),
            ]);

            const products = productsRes.data || [];
            const orders = ordersRes.data || [];

            setStats({
                totalProducts: products.length,
                activeProducts: products.filter(p => p.isActive).length,
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0),
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'from-purple-600 to-blue-600',
        },
        {
            title: 'Active Products',
            value: stats.activeProducts,
            icon: TrendingUp,
            color: 'from-green-600 to-emerald-600',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'from-orange-600 to-red-600',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'from-yellow-600 to-orange-600',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    Seller <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-gray-400">Manage your products and track your sales</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-card animate-pulse h-32"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="stat-card group cursor-pointer hover:scale-105 transition-transform"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="stat-card-value">{stat.value}</p>
                                <p className="stat-card-label">{stat.title}</p>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <div className="mt-12 glass-card">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/seller/products/add" className="btn-primary text-center">
                        Add New Product
                    </a>
                    <a href="/seller/products" className="btn-secondary text-center">
                        Manage Products
                    </a>
                    <a href="/seller/orders" className="btn-secondary text-center">
                        View Orders
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
