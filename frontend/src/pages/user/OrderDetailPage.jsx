import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data } = await orderAPI.getById(id);
            setOrder(data);
        } catch (error) {
            toast.error('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="glass-card animate-pulse h-96"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="page-container">
                <div className="section-container text-center">
                    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                    <Link to="/orders" className="btn-primary">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container max-w-4xl mx-auto">
                <Link to="/orders" className="btn-ghost flex items-center space-x-2 mb-6 inline-flex">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Orders</span>
                </Link>

                <h1 className="text-4xl font-bold mb-8">
                    Order <span className="gradient-text">#{order.id}</span>
                </h1>

                <div className="space-y-6">
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-4">Order Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="badge-info">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Order Date</span>
                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Amount</span>
                                <span className="text-2xl font-bold gradient-text">
                                    ${parseFloat(order.totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-4">Items</h3>
                        <div className="space-y-4">
                            {order.OrderItems?.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                                    <img
                                        src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                        alt={item.Product?.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.Product?.name}</p>
                                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                        <p className="text-purple-400 font-semibold mt-1">
                                            ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-bold">
                                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {order.shippingAddress && (
                        <div className="glass-card">
                            <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
                            <p className="text-gray-300">{order.shippingAddress}</p>
                            {order.phoneNumber && (
                                <p className="text-gray-400 mt-2">Phone: {order.phoneNumber}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
