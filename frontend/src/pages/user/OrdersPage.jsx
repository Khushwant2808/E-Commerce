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
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="badge-info">{order.status}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-400">
                                            {order.OrderItems?.length || 0} items
                                        </p>
                                        <p className="text-2xl font-bold gradient-text">
                                            ${parseFloat(order.totalAmount).toFixed(2)}
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
