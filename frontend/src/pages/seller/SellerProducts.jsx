import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await productAPI.getMyProducts();
            setProducts(data || []);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productAPI.delete(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const toggleActive = async (product) => {
        try {
            await productAPI.updateMeta({
                id: product.id,
                isActive: !product.isActive,
            });
            toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`);
            fetchProducts();
        } catch (error) {
            toast.error('Failed to update product');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        My <span className="gradient-text">Products</span>
                    </h1>
                    <p className="text-gray-400">{products.length} products total</p>
                </div>
                <Link to="/seller/products/add" className="btn-primary flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="glass-card animate-pulse h-24"></div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="glass-card text-center py-20">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 mb-6">No products yet. Create your first product!</p>
                    <Link to="/seller/products/add" className="btn-primary">
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card flex items-center gap-6"
                        >
                            <img
                                src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-xl"
                            />

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    {product.isActive ? (
                                        <span className="badge-success">Active</span>
                                    ) : (
                                        <span className="badge-error">Inactive</span>
                                    )}
                                    {product.isFeatured && <span className="badge-info">Featured</span>}
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-1">{product.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-purple-400 font-semibold">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                                    <span className="text-gray-400 text-sm">
                                        Rating: {product.rating?.toFixed(1) || '0.0'} ({product.ratingCount || 0})
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleActive(product)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title={product.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    {product.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                                <Link
                                    to={`/seller/products/${product.id}/edit`}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Edit className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
