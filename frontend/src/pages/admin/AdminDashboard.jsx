import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users, Package, DollarSign, TrendingUp, ShoppingCart,
    ArrowUpRight, ArrowDownRight, Eye, RefreshCw
} from 'lucide-react';
import { productAPI, orderAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                adminAPI.getUsers().catch(() => ({ data: { users: [] } })),
                productAPI.getAll().catch(() => ({ data: { products: [] } })),
                adminAPI.getAllOrders().catch(() => ({ data: { orders: [] } })),
            ]);

            const users = usersRes.data?.users || [];
            const products = productsRes.data?.products || [];
            const orders = ordersRes.data?.orders || [];

            const totalRevenue = orders.reduce((sum, order) => {
                if (['completed', 'delivered', 'shipped'].includes(order.status)) {
                    return sum + parseFloat(order.totalAmount || 0);
                }
                return sum;
            }, 0);

            setStats({
                totalUsers: users.length,
                totalProducts: products.length,
                totalOrders: orders.length,
                totalRevenue,
            });

            setRecentOrders(orders.slice(0, 5));
            setRecentUsers(users.slice(0, 5));
        } catch (error) {
            console.error('Dashboard fetch error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDashboardData();
        setRefreshing(false);
        toast.success('Dashboard refreshed');
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-400 bg-yellow-400/10',
            shipped: 'text-purple-400 bg-purple-400/10',
            delivered: 'text-green-400 bg-green-400/10',
            cancelled: 'text-red-400 bg-red-400/10',
        };
        return colors[status] || 'text-gray-400 bg-gray-400/10';
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            gradient: 'from-purple-600 to-blue-600',
            change: '+12%',
            isPositive: true,
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            gradient: 'from-green-600 to-emerald-600',
            change: '+8%',
            isPositive: true,
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            gradient: 'from-orange-600 to-red-600',
            change: '+23%',
            isPositive: true,
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            gradient: 'from-yellow-600 to-orange-600',
            change: '+15%',
            isPositive: true,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card h-40 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-card h-80 animate-pulse" />
                    <div className="glass-card h-80 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here's your platform overview.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="btn-secondary flex items-center gap-2 self-start"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                        <p className="text-gray-400 text-sm mt-1">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                            View All <Eye className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                            #{order.id}
                                        </div>
                                        <div>
                                            <p className="font-medium">{order.User?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Users</h2>
                        <Link to="/admin/users" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm">
                            View All <Eye className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentUsers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No users yet</p>
                    ) : (
                        <div className="space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                            {user.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                        {user.canSell && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                                Seller
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card"
            >
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/users" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group">
                        <Users className="w-8 h-8 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                        <p className="font-medium">Manage Users</p>
                    </Link>
                    <Link to="/admin/orders" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                        <p className="font-medium">Manage Orders</p>
                    </Link>
                    <Link to="/products" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group">
                        <Package className="w-8 h-8 mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" />
                        <p className="font-medium">View Products</p>
                    </Link>
                    <Link to="/" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-center group">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
                        <p className="font-medium">View Site</p>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
