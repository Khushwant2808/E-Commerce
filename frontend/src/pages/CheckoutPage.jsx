import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        phoneNumber: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.Product.price,
                })),
                totalAmount: totalPrice,
                shippingAddress: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                phoneNumber: formData.phoneNumber,
            };

            const { data } = await orderAPI.create(orderData);
            toast.success('Order placed successfully!');
            await clearCart();
            navigate(`/orders/${data.order.id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="section-container">
                <h1 className="text-4xl font-bold mb-8">
                    <span className="gradient-text">Checkout</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            <div className="glass-card">
                                <div className="flex items-center space-x-3 mb-6">
                                    <MapPin className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-2xl font-bold">Shipping Address</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Address Line 1</label>
                                        <input
                                            type="text"
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                            required
                                            className="input-field"
                                            placeholder="Street address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Address Line 2</label>
                                        <input
                                            type="text"
                                            value={formData.addressLine2}
                                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                            className="input-field"
                                            placeholder="Apartment, suite, etc. (optional)"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">State</label>
                                            <input
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                value={formData.pincode}
                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card">
                                <div className="flex items-center space-x-3 mb-6">
                                    <CreditCard className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-2xl font-bold">Payment Method</h2>
                                </div>
                                <p className="text-gray-400">Cash on Delivery (COD)</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg"
                            >
                                <CheckCircle className="w-6 h-6" />
                                <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
                            </button>
                        </motion.form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <img
                                            src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                            alt={item.Product?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{item.Product?.name}</p>
                                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                            <p className="text-purple-400 font-semibold">
                                                ${(parseFloat(item.Product?.price || 0) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-white/10 pt-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
