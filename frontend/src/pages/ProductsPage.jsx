import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sort: 'createdAt',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, [filters.sort, pagination.currentPage, search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.currentPage,
                limit: 12,
                search: search || undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
            };

            const { data } = await productAPI.getAll(params);
            setProducts(data.products || []);
            setPagination({
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalItems: data.totalItems,
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchProducts();
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({ minPrice: '', maxPrice: '', sort: 'createdAt' });
        setSearch('');
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchProducts();
    };

    return (
        <div className="page-container">
            <div className="section-container">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Discover <span className="gradient-text">Products</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {pagination.totalItems} products available
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="input-field pl-12"
                            />
                        </div>
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-secondary flex items-center justify-center space-x-2"
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        <span>Filters</span>
                    </button>
                </div>

                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="glass-card mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Filters</h3>
                            <button onClick={() => setShowFilters(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Min Price</label>
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    placeholder="$0"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Max Price</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    placeholder="$1000"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="createdAt">Newest</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                    <option value="-rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={applyFilters} className="btn-primary flex-1">
                                Apply Filters
                            </button>
                            <button onClick={clearFilters} className="btn-secondary">
                                Clear All
                            </button>
                        </div>
                    </motion.div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="glass-card animate-pulse">
                                <div className="w-full aspect-square bg-white/5 rounded-xl mb-4"></div>
                                <div className="h-4 bg-white/5 rounded mb-2"></div>
                                <div className="h-4 bg-white/5 rounded w-2/3 mb-4"></div>
                                <div className="h-10 bg-white/5 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="glass-card text-center py-20">
                        <p className="text-gray-400 text-lg">No products found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                    disabled={pagination.currentPage === 1}
                                    className="btn-secondary"
                                >
                                    Previous
                                </button>
                                <span className="flex items-center px-4 glass rounded-lg">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="btn-secondary"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
