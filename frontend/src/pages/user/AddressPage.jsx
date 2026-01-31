import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Home, Briefcase, CheckCircle, ArrowLeft, Pencil } from 'lucide-react';
import { addressAPI } from '../../services/api'; // Fix import path
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddressPage = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form state
    const [newAddress, setNewAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await addressAPI.getAll();
            setAddresses(data || []);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                const { data } = await addressAPI.update({ ...newAddress, id: editingId });
                toast.success('Address updated successfully');
                setAddresses(prev => prev.map(addr => addr.id === editingId ? data.address : addr));
            } else {
                const { data } = await addressAPI.create(newAddress);
                toast.success('Address added successfully');
                setAddresses(prev => [...prev, data.address]);
            }
            closeForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (addr) => {
        setNewAddress({
            line1: addr.line1,
            line2: addr.line2 || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country || 'India',
            isDefault: addr.isDefault || false
        });
        setEditingId(addr.id);
        setShowAddForm(true);
    };

    const closeForm = () => {
        setShowAddForm(false);
        setEditingId(null);
        setNewAddress({
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            isDefault: false
        });
    };

    const handleSetDefault = async (addressId) => {
        // Implementation depends on if update API supports setting default specifically
        // Assuming updateAddress handles general updates. 
        // Since we don't have deeply detailed update logic in this snippet, 
        // we might skip this or implement if backend supports it.
        // Based on checkout page, it seems update might not be fully utilized for strictly toggling default easily without other data.
        // We'll skip adding a specific "Set Default" button for now to avoid complexity if backend isn't ready, 
        // or just let the "Add" form handle the first default.
        // Actually, let's just show the list beautifully.
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 glass-card rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="section-container max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-4xl font-bold">
                        My <span className="gradient-text">Addresses</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Address Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setEditingId(null);
                            setShowAddForm(true);
                        }}
                        className="glass-card flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 group-hover:text-white">Add New Address</h3>
                    </motion.button>

                    {/* Address List */}
                    {addresses.map((addr) => (
                        <motion.div
                            key={addr.id}
                            className="glass-card relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    {addr.isDefault && (
                                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Default
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleEdit(addr)}
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        title="Edit Address"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-1 mb-4">
                                    <h3 className="font-bold text-lg">{addr.line1}</h3>
                                    {addr.line2 && <p className="text-gray-400">{addr.line2}</p>}
                                    <p className="text-gray-300">
                                        {addr.city}, {addr.state}
                                    </p>
                                    <p className="text-gray-400 text-sm font-mono tracking-wider">
                                        PIN: {addr.pincode}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Address Modal (Form) */}
                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            onClick={closeForm}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        <div
                            className="glass-card w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="w-6 h-6 text-purple-400" />
                                {editingId ? 'Edit Address' : 'Add New Address'}
                            </h2>

                            <form onSubmit={handleAddAddress} className="space-y-6">
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Address Line 1 *"
                                        value={newAddress.line1}
                                        onChange={e => setNewAddress({ ...newAddress, line1: e.target.value })}
                                        required
                                        className="input-field w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address Line 2 (Optional)"
                                        value={newAddress.line2}
                                        onChange={e => setNewAddress({ ...newAddress, line2: e.target.value })}
                                        className="input-field w-full"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City *"
                                            value={newAddress.city}
                                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                            required
                                            className="input-field w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="State *"
                                            value={newAddress.state}
                                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                            required
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Pincode *"
                                            value={newAddress.pincode}
                                            onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            required
                                            className="input-field w-full"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Country"
                                            value={newAddress.country}
                                            onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                            className="input-field w-full"
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newAddress.isDefault ? 'bg-purple-500 border-purple-500' : 'border-gray-500'}`}>
                                            {newAddress.isDefault && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={newAddress.isDefault}
                                            onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                            className="hidden"
                                        />
                                        <span className="text-gray-300">Set as default delivery address</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex-1"
                                    >
                                        {submitting ? 'Saving Address...' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressPage;
