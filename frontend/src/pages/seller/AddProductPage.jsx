import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await productAPI.create({
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            });
            toast.success('Product created successfully!');
            navigate('/seller/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/seller/products')}
                className="btn-ghost flex items-center space-x-2 mb-6"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Products</span>
            </button>

            <h1 className="text-4xl font-bold mb-8">
                Add New <span className="gradient-text">Product</span>
            </h1>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="max-w-2xl"
            >
                <div className="glass-card space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Product Name*</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="input-field"
                            placeholder="Amazing Product"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Describe your product..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Price*</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="input-field"
                                placeholder="99.99"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Stock*</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                className="input-field"
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="input-field"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.imageUrl && (
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="mt-4 w-full max-w-xs rounded-xl object-cover"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>{loading ? 'Creating...' : 'Create Product'}</span>
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default AddProductPage;
