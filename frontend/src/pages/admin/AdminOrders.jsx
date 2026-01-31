import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Package, Search, Eye, ChevronDown, Truck, Check, X, Clock, RefreshCw
} from 'lucide-react';
import { adminAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await adminAPI.getAllOrders();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setActionLoading(orderId);
        try {
            await orderAPI.updateStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
            shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
            delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
            cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
        };
        return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: Clock,
            shipped: Truck,
            delivered: Check,
            cancelled: X,
        };
        const Icon = icons[status] || Clock;
        return <Icon className="w-4 h-4" />;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchQuery) ||
            order.User?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.User?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
                <div className="glass-card">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold">
                        <span className="gradient-text">Order Management</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field w-full sm:w-48"
                >
                    <option value="all">All Status</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="glass-card text-center py-12">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-500">No orders found</p>
                    </div>
                ) : (
                    filteredOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card"
                        >
                            {/* Order Header */}
                            <div
                                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{order.User?.name || 'Unknown Customer'}</p>
                                        <p className="text-sm text-gray-400">{order.User?.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold gradient-text">${parseFloat(order.totalAmount).toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="capitalize font-medium">{order.status}</span>
                                    </div>

                                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedOrder === order.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 pt-6 border-t border-white/10"
                                >
                                    {/* Order Items */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-4">Order Items</h4>
                                        <div className="space-y-3">
                                            {order.orderItems?.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                                                    <img
                                                        src={item.Product?.imageUrl || 'https://via.placeholder.com/80'}
                                                        alt={item.Product?.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.Product?.name}</p>
                                                        <p className="text-sm text-gray-400">
                                                            Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {order.Address && (
                                        <div className="mb-6">
                                            <h4 className="font-semibold mb-2">Shipping Address</h4>
                                            <p className="text-gray-400">
                                                {order.Address.line1}, {order.Address.city}, {order.Address.state} - {order.Address.pincode}
                                            </p>
                                        </div>
                                    )}

                                    {/* Status Update */}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-gray-400 mr-2">Update Status:</span>
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(order.id, status)}
                                                disabled={actionLoading === order.id || order.status === status}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${order.status === status
                                                    ? `${getStatusColor(status)} border`
                                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                    } disabled:opacity-50`}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
