import { useState, useEffect } from 'react';
import { ProductService } from '../../services/productService';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const ProductListingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
            setProducts([
                { id: 1, name: "Minimalist Watch", price: 199.99, rating: 4.8, imageUrl: "" },
                { id: 2, name: "Leather Tote", price: 249.50, rating: 4.5, imageUrl: "" },
                { id: 3, name: "Ceramic Vase", price: 89.00, rating: 4.9, imageUrl: "" },
                { id: 4, name: "Noise Cancelling Headphones", price: 340.00, rating: 4.7, imageUrl: "" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-white">Shop Collection</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 glass-input text-white w-full sm:w-64"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="pl-9 glass-input text-white appearance-none cursor-pointer pr-8"
                        >
                            <option value="newest" className="bg-neutral-900">Newest</option>
                            <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                            <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-20">Loading products...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="glass-card overflow-hidden group"
                            >
                                <div className="aspect-square bg-neutral-800 relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-neutral-700 bg-neutral-800">
                                            No Image
                                        </div>
                                    )}

                                    <button
                                        onClick={() => addToCart(product)}
                                        className="absolute bottom-4 right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:bg-neutral-200"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <Link to={`/products/${product.id}`} className="text-white font-medium hover:text-neutral-300 truncate block flex-1">
                                            {product.name}
                                        </Link>
                                        <div className="flex items-center text-yellow-500 text-xs ml-2">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="ml-1 text-neutral-400">{product.rating || 0}</span>
                                        </div>
                                    </div>
                                    <p className="text-neutral-500 text-sm font-semibold">${product.price}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-neutral-500 py-12">
                            No products found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductListingPage;
