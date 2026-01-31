import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ChevronDown,
    ChevronUp,
    User,
    MapPin,
    Calendar,
    CheckCircle2,
    Truck,
    Clock,
    XCircle,
    RotateCcw,
    DollarSign
} from 'lucide-react';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingItems, setUpdatingItems] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await orderAPI.getSellerOrders();
            setOrders(data || []);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (itemId, newStatus) => {
        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        try {
            await orderAPI.updateItemStatus(itemId, newStatus);
            toast.success(`Item marked as ${newStatus}`);
            fetchOrders(); // Refresh to get updated statuses
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'delivered': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
            case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/20';
            case 'returned': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
            default: return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            case 'returned': return <RotateCcw className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card animate-pulse h-40"></div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card text-center py-24 flex flex-col items-center gap-4"
            >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold">No Orders Yet</h2>
                <p className="text-gray-400 max-w-sm">When customers purchase your products, they will appear here for management.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                    Order <span className="gradient-text">Management</span>
                </h1>
                <p className="text-gray-400 font-medium">Manage individual product fulfillment and status tracking.</p>
            </header>

            <div className="grid gap-6">
                {orders.map((order, index) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`glass-card overflow-hidden transition-all duration-300 ${expandedOrder === order.id ? 'ring-2 ring-purple-500/50' : 'hover:bg-white/5'}`}
                    >
                        {/* Summary Bar */}
                        <div
                            className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Order #{order.id}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 font-bold text-gray-300"><DollarSign className="w-3 h-3" /> Revenue: ${parseFloat(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:block text-right">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                        <User className="w-4 h-4 text-purple-400" />
                                        {order.User?.name || order.User?.email}
                                    </div>
                                    <p className="text-xs text-gray-500">{order.orderItems?.length} products for you</p>
                                </div>
                                <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {expandedOrder === order.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/10"
                                >
                                    <div className="p-6 bg-gradient-to-b from-black/20 to-transparent">
                                        {/* Customer Info Card */}
                                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-purple-400 mb-3 flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" /> Shipping Details
                                                </h4>
                                                <p className="text-sm font-bold text-white mb-1">{order.Address?.line1}</p>
                                                <p className="text-xs text-gray-400">{order.Address?.city}, {order.Address?.state} - {order.Address?.pincode}</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                                                    <User className="w-3 h-3" /> Customer Info
                                                </h4>
                                                <p className="text-sm font-bold text-white mb-1">{order.User?.name}</p>
                                                <p className="text-xs text-gray-400">{order.User?.email}</p>
                                            </div>
                                        </div>

                                        {/* Individual Order Items */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-4 px-2">Products in this Order</h4>
                                            {order.orderItems?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex flex-wrap items-center justify-between gap-6"
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                                            <img
                                                                src={item.Product?.imageUrl}
                                                                alt={item.Product?.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-white mb-1">{item.Product?.name}</h5>
                                                            <div className="flex items-center gap-3 text-xs">
                                                                <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300">Qty: {item.quantity}</span>
                                                                <span className="font-bold text-purple-400">${item.price} each</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        {/* Status Display */}
                                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusStyles(item.status)} font-bold text-xs`}>
                                                            {getStatusIcon(item.status)}
                                                            {item.status?.toUpperCase()}
                                                        </div>

                                                        {/* Status Actions */}
                                                        <div className="flex gap-2">
                                                            {item.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(item.id, 'shipped')}
                                                                    disabled={updatingItems[item.id]}
                                                                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-black uppercase tracking-tighter transition-all disabled:opacity-50"
                                                                >
                                                                    Ship Now
                                                                </button>
                                                            )}
                                                            {item.status === 'shipped' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(item.id, 'delivered')}
                                                                    disabled={updatingItems[item.id]}
                                                                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-tighter transition-all disabled:opacity-50"
                                                                >
                                                                    Mark Delivered
                                                                </button>
                                                            )}
                                                            {item.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleStatusUpdate(item.id, 'cancelled')}
                                                                    disabled={updatingItems[item.id]}
                                                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 text-xs font-black uppercase tracking-tighter transition-all disabled:opacity-50 border border-white/10"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SellerOrders;
