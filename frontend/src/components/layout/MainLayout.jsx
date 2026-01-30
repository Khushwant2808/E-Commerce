import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-16">
                <Outlet />
            </main>
            <footer className="glass border-t border-white/10 mt-20">
                <div className="section-container py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 gradient-text">LuxeCommerce</h3>
                            <p className="text-gray-400 text-sm">Your premium shopping destination for quality products.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                                <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
                                <li><Link to="/products?sort=price" className="hover:text-white transition-colors">Best Deals</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                                <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
                                <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">About</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
                        <p>&copy; 2024 LuxeCommerce. All rights reserved.</p>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default MainLayout;
