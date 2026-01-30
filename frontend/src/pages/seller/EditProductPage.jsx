import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

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
        return (
            <div className="glass-card animate-pulse h-96"></div>
        );
    }

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
                Edit <span className="gradient-text">Product</span>
            </h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="glass-card space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Product Name*</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="input-field resize-none"
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
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="input-field"
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
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/5 border-white/10 text-purple-600"
                            />
                            <span>Active</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-5 h-5 rounded bg-white/5 border-white/10 text-purple-600"
                            />
                            <span>Featured</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
