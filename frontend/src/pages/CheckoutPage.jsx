import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle, Phone, Plus, Truck, ArrowLeft, ArrowRight, Wallet, Banknote, Check, Edit2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderAPI, addressAPI, phoneAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cart, totalPrice, clearCart, fetchCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Phone, 3: Payment, 4: Review
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Addresses
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false
    });

    // Phone
    const [phone, setPhone] = useState(null);
    const [newPhone, setNewPhone] = useState('');
    const [editingPhone, setEditingPhone] = useState(false);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            // Fetch addresses
            const addressRes = await addressAPI.getAll();
            const addrs = Array.isArray(addressRes.data) ? addressRes.data : [];
            setAddresses(addrs);
            // Auto-select default or first address
            const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
            if (defaultAddr) setSelectedAddress(defaultAddr);

            // Fetch phone
            try {
                const phoneRes = await phoneAPI.get();
                if (phoneRes.data?.phoneNumber) {
                    setPhone(phoneRes.data.phoneNumber);
                    setNewPhone(phoneRes.data.phoneNumber);
                }
            } catch (err) {
                // No phone saved - that's ok
                console.log('[Checkout] No phone saved');
            }
        } catch (error) {
            console.error('[Checkout] Error loading data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await addressAPI.create(newAddress);
            toast.success('Address added!');
            setAddresses([...addresses, data.address]);
            setSelectedAddress(data.address);
            setShowAddAddress(false);
            setNewAddress({ line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', isDefault: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePhone = async () => {
        if (!newPhone || newPhone.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }
        setLoading(true);
        try {
            if (phone) {
                await phoneAPI.update({ phoneNumber: newPhone });
            } else {
                await phoneAPI.add({ phoneNumber: newPhone });
            }
            setPhone(newPhone);
            setEditingPhone(false);
            toast.success('Phone number saved!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save phone');
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select an address');
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            // Place order via API
            const { data: orderData } = await orderAPI.create({});

            console.log('[Checkout] Order placed:', orderData);

            // Initialize payment
            const { data: paymentData } = await paymentAPI.initialize({
                orderId: orderData.orderId,
                method: paymentMethod
            });

            console.log('[Checkout] Payment initialized:', paymentData);

            if (paymentMethod === 'cod') {
                toast.success('Order placed successfully! Pay when delivered.');
                await fetchCart(); // Refresh cart (should be empty now)
                navigate(`/orders/${orderData.orderId}`);
            } else {
                // For online payment, verify immediately (mock payment success)
                const { data: verifyData } = await paymentAPI.verify({
                    paymentId: paymentData.paymentId,
                    status: 'success'
                });
                toast.success('Payment successful! Order placed.');
                await fetchCart();
                navigate(`/orders/${orderData.orderId}`);
            }
        } catch (error) {
            console.error('[Checkout] Error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return selectedAddress !== null;
            case 2: return true; // Phone is optional
            case 3: return paymentMethod !== null;
            default: return true;
        }
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    if (loadingData) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="page-container">
                <div className="section-container text-center py-20">
                    <Truck className="w-24 h-24 mx-auto text-gray-600 mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">Add some products before checkout</p>
                    <button onClick={() => navigate('/products')} className="btn-primary">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-xl mx-auto">
                        {[
                            { num: 1, label: 'Address', icon: MapPin },
                            { num: 2, label: 'Phone', icon: Phone },
                            { num: 3, label: 'Payment', icon: CreditCard },
                            { num: 4, label: 'Review', icon: CheckCircle }
                        ].map((s, i) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= s.num
                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                            : 'bg-white/5 text-gray-500'
                                        }`}
                                >
                                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                                </div>
                                <span className={`ml-2 text-sm hidden sm:block ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                                    {s.label}
                                </span>
                                {i < 3 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${step > s.num ? 'bg-purple-500' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Address */}
                            {step === 1 && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <MapPin className="text-purple-400" />
                                        Select Delivery Address
                                    </h2>

                                    {addresses.length === 0 && !showAddAddress ? (
                                        <div className="text-center py-10">
                                            <MapPin className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                                            <p className="text-gray-400 mb-4">No addresses saved</p>
                                            <button onClick={() => setShowAddAddress(true)} className="btn-primary">
                                                <Plus className="w-5 h-5 mr-2" /> Add Address
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses.map(addr => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddress(addr)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id
                                                            ? 'border-purple-500 bg-purple-500/10'
                                                            : 'border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold">{addr.line1}</p>
                                                            {addr.line2 && <p className="text-gray-400 text-sm">{addr.line2}</p>}
                                                            <p className="text-gray-400 text-sm">
                                                                {addr.city}, {addr.state} - {addr.pincode}
                                                            </p>
                                                        </div>
                                                        {addr.isDefault && (
                                                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {!showAddAddress && (
                                                <button
                                                    onClick={() => setShowAddAddress(true)}
                                                    className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" /> Add New Address
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Add Address Form */}
                                    {showAddAddress && (
                                        <motion.form
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={handleAddAddress}
                                            className="mt-6 p-4 bg-white/5 rounded-xl space-y-4"
                                        >
                                            <h3 className="font-semibold mb-4">Add New Address</h3>
                                            <input
                                                type="text"
                                                placeholder="Address Line 1 *"
                                                value={newAddress.line1}
                                                onChange={e => setNewAddress({ ...newAddress, line1: e.target.value })}
                                                required
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address Line 2 (Optional)"
                                                value={newAddress.line2}
                                                onChange={e => setNewAddress({ ...newAddress, line2: e.target.value })}
                                                className="input-field"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={newAddress.city}
                                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    required
                                                    className="input-field"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State *"
                                                    value={newAddress.state}
                                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    required
                                                    className="input-field"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Pincode *"
                                                    value={newAddress.pincode}
                                                    onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                                    required
                                                    className="input-field"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Country"
                                                    value={newAddress.country}
                                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-gray-400">
                                                <input
                                                    type="checkbox"
                                                    checked={newAddress.isDefault}
                                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                                    className="rounded"
                                                />
                                                Set as default address
                                            </label>
                                            <div className="flex gap-4">
                                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                                    {loading ? 'Saving...' : 'Save Address'}
                                                </button>
                                                <button type="button" onClick={() => setShowAddAddress(false)} className="btn-secondary flex-1">
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 2: Phone */}
                            {step === 2 && (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <Phone className="text-purple-400" />
                                        Contact Number
                                    </h2>

                                    {!editingPhone && phone ? (
                                        <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-400 text-sm">Phone Number</p>
                                                <p className="text-xl font-semibold">{phone}</p>
                                            </div>
                                            <button onClick={() => setEditingPhone(true)} className="btn-secondary">
                                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <p className="text-gray-400">
                                                {phone ? 'Update your phone number' : 'Add a phone number for delivery updates'}
                                            </p>
                                            <input
                                                type="tel"
                                                placeholder="10-digit phone number"
                                                value={newPhone}
                                                onChange={e => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="input-field text-xl tracking-wider"
                                                maxLength={10}
                                            />
                                            <div className="flex gap-4">
                                                <button onClick={handleSavePhone} disabled={loading} className="btn-primary flex-1">
                                                    {loading ? 'Saving...' : 'Save Phone'}
                                                </button>
                                                {phone && (
                                                    <button onClick={() => setEditingPhone(false)} className="btn-secondary flex-1">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 3: Payment Method */}
                            {step === 3 && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <CreditCard className="text-purple-400" />
                                        Select Payment Method
                                    </h2>

                                    <div className="space-y-4">
                                        <div
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cod'
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Banknote className="w-6 h-6 text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">Cash on Delivery</p>
                                                <p className="text-gray-400 text-sm">Pay when your order arrives</p>
                                            </div>
                                            {paymentMethod === 'cod' && <Check className="w-6 h-6 text-purple-400" />}
                                        </div>

                                        <div
                                            onClick={() => setPaymentMethod('online')}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'online'
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <Wallet className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">Pay Online</p>
                                                <p className="text-gray-400 text-sm">Credit/Debit Card, UPI, Net Banking</p>
                                            </div>
                                            {paymentMethod === 'online' && <Check className="w-6 h-6 text-purple-400" />}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Review */}
                            {step === 4 && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="glass-card"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <CheckCircle className="text-purple-400" />
                                        Review Your Order
                                    </h2>

                                    <div className="space-y-6">
                                        {/* Delivery Address */}
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-gray-400 text-sm font-medium">Delivery Address</p>
                                                <button onClick={() => setStep(1)} className="text-purple-400 text-sm">Change</button>
                                            </div>
                                            <p className="font-semibold">{selectedAddress?.line1}</p>
                                            {selectedAddress?.line2 && <p className="text-sm">{selectedAddress.line2}</p>}
                                            <p className="text-gray-400 text-sm">
                                                {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                                            </p>
                                        </div>

                                        {/* Phone */}
                                        {phone && (
                                            <div className="p-4 bg-white/5 rounded-xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-gray-400 text-sm font-medium">Contact Number</p>
                                                    <button onClick={() => setStep(2)} className="text-purple-400 text-sm">Change</button>
                                                </div>
                                                <p className="font-semibold">{phone}</p>
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-gray-400 text-sm font-medium">Payment Method</p>
                                                <button onClick={() => setStep(3)} className="text-purple-400 text-sm">Change</button>
                                            </div>
                                            <p className="font-semibold flex items-center gap-2">
                                                {paymentMethod === 'cod' ? (
                                                    <><Banknote className="w-5 h-5 text-green-400" /> Cash on Delivery</>
                                                ) : (
                                                    <><Wallet className="w-5 h-5 text-blue-400" /> Pay Online</>
                                                )}
                                            </p>
                                        </div>

                                        {/* Order Items */}
                                        <div className="border-t border-white/10 pt-6">
                                            <p className="text-gray-400 text-sm font-medium mb-4">Order Items ({cart.length})</p>
                                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                                {cart.map(item => (
                                                    <div key={item.productId} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                                                        <img
                                                            src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                                            alt={item.Product?.name}
                                                            className="w-14 h-14 object-cover rounded-lg"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm">{item.Product?.name}</p>
                                                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-purple-400 font-semibold">
                                                            ${(parseFloat(item.Product?.price || 0) * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`btn-secondary flex items-center gap-2 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <ArrowLeft className="w-5 h-5" /> Back
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className={`btn-primary flex items-center gap-2 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2 text-lg px-8"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            {paymentMethod === 'cod' ? 'Place Order' : `Pay $${totalPrice.toFixed(2)}`}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <img
                                            src={item.Product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                                            alt={item.Product?.name}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm line-clamp-1">{item.Product?.name}</p>
                                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                                            <p className="text-purple-400 font-semibold text-sm">
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
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-3 border-t border-white/10">
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
