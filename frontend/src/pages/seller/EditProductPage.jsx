import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Save,
    Tag,
    DollarSign,
    Package,
    Image as ImageIcon,
    AlignLeft,
    Eye,
    Zap
} from 'lucide-react';

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        isActive: true,
        isFeatured: false,
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await productAPI.getById(id);
            setFormData({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                stock: data.stock || '',
                imageUrl: data.imageUrl || '',
                isActive: data.isActive ?? true,
                isFeatured: data.isFeatured ?? false,
            });
        } catch (error) {
            toast.error('Failed to fetch product');
            navigate('/seller/products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await productAPI.updateMeta({
                id: parseInt(id),
                ...formData,
                price: parseFloat(formData.price),
            });

            if (formData.stock !== '') {
                await productAPI.updateStock({
                    id: parseInt(id),
                    stock: parseInt(formData.stock),
                });
            }

            toast.success('Product updated successfully!');
            navigate('/seller/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="glass-card animate-pulse h-96"></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/seller/products')}
                className="btn-ghost flex items-center space-x-2 mb-8 hover:-translate-x-1 transition-transform"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Products</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            Edit <span className="gradient-text">Product</span>
                        </h1>
                        <p className="text-gray-400">Update your product details and inventory</p>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-purple-400" />
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="input-field w-full pl-4"
                                placeholder="e.g., Premium Leather Jacket"
                            />
                        </div>

                        {/* Price & Stock Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="input-field w-full pl-8"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-400" />
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="input-field w-full"
                                    placeholder="Available quantity"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-yellow-400" />
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="input-field w-full resize-none"
                                placeholder="Describe your product..."
                            />
                        </div>

                        {/* Image URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-pink-400" />
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="input-field w-full"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${formData.isActive
                                        ? 'bg-green-500/10 border-green-500/50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${formData.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                                        Status
                                    </span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className={`w-4 h-4 ${formData.isActive ? 'text-green-400' : 'text-gray-400'}`} />
                                    <span className={`text-sm ${formData.isActive ? 'text-green-200' : 'text-gray-500'}`}>
                                        {formData.isActive ? 'Visible to customers' : 'Hidden from store'}
                                    </span>
                                </div>
                            </div>

                            <div
                                onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 ${formData.isFeatured
                                        ? 'bg-amber-500/10 border-amber-500/50'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${formData.isFeatured ? 'text-amber-400' : 'text-gray-400'}`}>
                                        Featured
                                    </span>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isFeatured ? 'bg-amber-500' : 'bg-gray-600'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isFeatured ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className={`w-4 h-4 ${formData.isFeatured ? 'text-amber-400' : 'text-gray-400'}`} />
                                    <span className={`text-sm ${formData.isFeatured ? 'text-amber-200' : 'text-gray-500'}`}>
                                        {formData.isFeatured ? 'Promoted on home' : 'Standard listing'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full btn-primary flex items-center justify-center space-x-2 py-3 mt-6 text-lg group"
                        >
                            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>{saving ? 'Saving Changes...' : 'Save Product'}</span>
                        </button>
                    </form>
                </motion.div>

                {/* Preview Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full lg:w-96"
                >
                    <div className="sticky top-24">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-300">Live Preview</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                                How user sees it
                            </span>
                        </div>

                        <div className="glass-card p-4 overflow-hidden relative group">
                            {/* Card Decoration */}
                            <div className="absolute top-0 right-0 p-3 z-10">
                                {formData.isFeatured && (
                                    <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <Zap className="w-3 h-3 fill-current" />
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Image Preview */}
                            <div className="aspect-square rounded-xl overflow-hidden bg-white/5 mb-4 relative">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=800&q=80';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <span className="text-sm">No image provided</span>
                                    </div>
                                )}
                                {!formData.isActive && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-semibold">
                                            Currently Inactive
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content Preview */}
                            <div>
                                <h4 className="font-bold text-lg mb-1 truncate">
                                    {formData.name || 'Product Name'}
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-3 h-10">
                                    {formData.description || 'Product description will appear here...'}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Price</p>
                                        <p className="text-xl font-bold gradient-text">
                                            ${parseFloat(formData.price || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                                        <p className={`font-medium ${parseInt(formData.stock) > 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {formData.stock || 0} units
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                            <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4" />
                                Pro Tips
                            </h4>
                            <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                                <li>Use high-quality square images for best results.</li>
                                <li>Featured products appear on the homepage.</li>
                                <li>Detailed descriptions improve search visibility.</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EditProductPage;
