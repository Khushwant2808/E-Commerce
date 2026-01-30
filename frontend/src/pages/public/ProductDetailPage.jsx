import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { Star, Truck, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        // Mock fetch if real API fails or for demo
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Simulate API call
                // const data = await ProductService.getOne(id);

                // Mock Data since backend might be empty
                const mockData = {
                    id: parseInt(id),
                    name: "Minimalist Leather Tote",
                    price: 249.50,
                    description: "Crafted from premium Italian leather, this tote features a clean, structured silhouette perfect for the modern professional. The spacious interior accommodates a 13-inch laptop, while the magnetic closure ensures your essentials stay secure. Available in a sophisticated palette of neutral tones.",
                    rating: 4.8,
                    reviews: 124,
                    stock: 5,
                    images: [
                        "", // Placeholder
                        "", // Placeholder
                        ""  // Placeholder
                    ]
                };
                setProduct(mockData);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;
    if (!product) return <div className="text-white text-center py-20">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <Link to="/products" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-neutral-800 rounded-2xl overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                            Main Image (Placeholder)
                        </div>
                        {/* <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" /> */}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {[0, 1, 2].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-square rounded-lg bg-neutral-800 border-2 transition-all ${activeImage === idx ? 'border-white' : 'border-transparent hover:border-neutral-600'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-2xl font-semibold text-neutral-200">${product.price}</span>
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1 text-sm text-neutral-300">{product.rating} ({product.reviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-neutral-400 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="space-y-4 mb-8">
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full btn-primary flex items-center justify-center py-4 text-lg"
                        >
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            Add to Cart
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-neutral-400">
                        <div className="flex items-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                            <Truck className="w-5 h-5 mr-3 text-white" />
                            Free Shipping
                        </div>
                        <div className="flex items-center p-4 rounded-xl bg-neutral-800/50 border border-neutral-800">
                            <ShieldCheck className="w-5 h-5 mr-3 text-white" />
                            2-Year Warranty
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
