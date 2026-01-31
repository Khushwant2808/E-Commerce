import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="glass-card animate-pulse h-96"></div>;
    }

    if (orders.length === 0) {
        return (
            <div className="glass-card text-center py-20">
                <p className="text-gray-400">No orders yet</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">
                <span className="gradient-text">Orders</span>
            </h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="glass-card">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-semibold text-lg">Order #{order.id}</p>
                                <p className="text-sm text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Buyer: {order.User?.name || order.User?.email || 'Unknown'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                    order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {order.status?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <p className="text-gray-400 text-sm">{order.orderItems?.length} items</p>
                            <div>
                                <p className="text-xs text-gray-400 text-right">Your Revenue</p>
                                <p className="text-2xl font-bold gradient-text">${parseFloat(order.totalAmount).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerOrders;
