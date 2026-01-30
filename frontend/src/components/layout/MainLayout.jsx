import { Outlet } from 'react-router-dom';
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
                                <li><a href="/products" className="hover:text-white transition-colors">All Products</a></li>
                                <li><a href="/products?featured=true" className="hover:text-white transition-colors">Featured</a></li>
                                <li><a href="/products?sort=price" className="hover:text-white transition-colors">Best Deals</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="/orders" className="hover:text-white transition-colors">Track Order</a></li>
                                <li><a href="/profile" className="hover:text-white transition-colors">My Account</a></li>
                                <li><a href="/wishlist" className="hover:text-white transition-colors">Wishlist</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">About</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
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
