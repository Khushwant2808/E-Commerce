import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { orderAPI } from '../../services/api';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await orderAPI.getAll();
            setOrders(data || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-8">
                    My <span className="gradient-text">Orders</span>
                </h1>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse h-32"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="glass-card text-center py-20">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-gray-400 mb-6">No orders yet</p>
                        <Link to="/products" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/orders/${order.id}`} className="block glass-card hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-semibold text-lg">Order #{order.id}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                    order.paymentStatus === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Images */}
                                    {order.orderItems && order.orderItems.length > 0 && (
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {order.orderItems.slice(0, 4).map((item, i) => (
                                                <img
                                                    key={i}
                                                    src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                                    alt={item.Product?.name}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />
                                            ))}
                                            {order.orderItems.length > 4 && (
                                                <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-sm text-gray-400">
                                                    +{order.orderItems.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-400">
                                            {order.orderItems?.length || 0} items
                                        </p>
                                        <p className="text-2xl font-bold gradient-text">
                                            ${parseFloat(order.totalAmount || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
