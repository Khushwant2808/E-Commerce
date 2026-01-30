import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Heart, Package, LogOut, Settings, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isAuthenticated, user, logout, isSeller, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="section-container">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text hidden sm:block">LuxeCommerce</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/orders">Orders</NavLink>
                                <NavLink to="/wishlist">Wishlist</NavLink>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs flex items-center justify-center font-bold shadow-lg shadow-purple-500/50">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="hidden lg:block font-medium">{user?.name}</span>
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden border border-white/10 shadow-xl"
                                        >
                                            <div className="p-3 border-b border-white/10">
                                                <p className="font-semibold">{user?.name}</p>
                                                <p className="text-sm text-gray-400">{user?.email}</p>
                                            </div>

                                            <div className="p-2">
                                                <MenuItem to="/profile" icon={Settings} onClick={() => setShowUserMenu(false)}>
                                                    Profile
                                                </MenuItem>
                                                <MenuItem to="/orders" icon={Package} onClick={() => setShowUserMenu(false)}>
                                                    My Orders
                                                </MenuItem>
                                                <MenuItem to="/wishlist" icon={Heart} onClick={() => setShowUserMenu(false)}>
                                                    Wishlist
                                                </MenuItem>
                                                {(isSeller || isAdmin) && (
                                                    <MenuItem to={isAdmin ? "/admin" : "/seller"} icon={Store} onClick={() => setShowUserMenu(false)}>
                                                        {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                                                    </MenuItem>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary">
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                                <MobileNavLink to="/products" onClick={() => setIsOpen(false)}>Products</MobileNavLink>
                                {isAuthenticated && (
                                    <>
                                        <MobileNavLink to="/orders" onClick={() => setIsOpen(false)}>Orders</MobileNavLink>
                                        <MobileNavLink to="/wishlist" onClick={() => setIsOpen(false)}>Wishlist</MobileNavLink>
                                        {(isSeller || isAdmin) && (
                                            <MobileNavLink
                                                to={isAdmin ? "/admin" : "/seller"}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                                            </MobileNavLink>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
    >
        {children}
    </Link>
);

const MenuItem = ({ to, icon: Icon, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
    >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
    >
        {children}
    </Link>
);

export default Navbar;
