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
                        <h3 className="text-xl font-bold mb-6">Items in this Order</h3>
                        <div className="space-y-6">
                            {order.orderItems?.map((item) => (
                                <div key={item.id} className="group flex flex-wrap gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5">
                                        <img
                                            src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                            alt={item.Product?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <h4 className="font-bold text-lg mb-1">{item.Product?.name}</h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>Qty: <span className="text-white">{item.quantity}</span></span>
                                            <span>Price: <span className="text-white">${parseFloat(item.price).toFixed(2)}</span></span>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${item.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    item.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        item.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-center">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Subtotal</p>
                                        <p className="text-xl font-black text-white">
                                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
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
