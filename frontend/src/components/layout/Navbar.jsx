import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Heart, Package, LogOut, Settings, Store, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const userMenuRef = useRef(null);
    const { isAuthenticated, user, logout, isSeller, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setShowUserMenu(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${scrolled
            ? 'bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-black/30'
            : 'bg-white/[0.02] backdrop-blur-xl border-b border-white/5'
            }`}>
            <div className="section-container">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                        >
                            <Store className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold hidden sm:block">
                            <span className="text-white">Luxe</span>
                            <span className="gradient-text">Commerce</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full p-1">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <NavLink to="/products" active={isActive('/products')}>Products</NavLink>
                        {isAuthenticated && (
                            <>
                                <NavLink to="/orders" active={isActive('/orders')}>Orders</NavLink>
                                <NavLink to="/wishlist" active={isActive('/wishlist')}>Wishlist</NavLink>
                            </>
                        )}
                        <NavLink to="/about" active={isActive('/about')}>About</NavLink>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link to="/cart" className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 group">
                            <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-[10px] flex items-center justify-center font-bold shadow-lg"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${showUserMenu ? 'bg-white/10' : 'hover:bg-white/10'}`}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="hidden lg:block font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="absolute right-0 mt-2 w-64 bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                                        >
                                            <div className="p-4 border-b border-white/10 bg-white/5">
                                                <p className="font-semibold text-white">{user?.name}</p>
                                                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                                            </div>

                                            <div className="p-2">
                                                {(isSeller || isAdmin) && (
                                                    <MenuItem
                                                        to={isAdmin ? "/admin" : "/seller"}
                                                        icon={LayoutDashboard}
                                                        onClick={() => setShowUserMenu(false)}
                                                        highlight
                                                    >
                                                        {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                                                    </MenuItem>
                                                )}

                                                <MenuItem to="/profile" icon={Settings} onClick={() => setShowUserMenu(false)}>
                                                    Settings
                                                </MenuItem>
                                                <MenuItem to="/orders" icon={Package} onClick={() => setShowUserMenu(false)}>
                                                    My Orders
                                                </MenuItem>
                                                <MenuItem to="/wishlist" icon={Heart} onClick={() => setShowUserMenu(false)}>
                                                    Wishlist
                                                </MenuItem>

                                                <div className="h-px bg-white/10 my-2" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Log Out</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2.5 hover:bg-white/10 rounded-xl transition-all"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isOpen ? 'close' : 'open'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="md:hidden overflow-hidden border-t border-white/5"
                        >
                            <div className="py-4 space-y-1">
                                <MobileNavLink to="/" onClick={() => setIsOpen(false)} active={isActive('/')}>Home</MobileNavLink>
                                <MobileNavLink to="/products" onClick={() => setIsOpen(false)} active={isActive('/products')}>Products</MobileNavLink>
                                {isAuthenticated && (
                                    <>
                                        <MobileNavLink to="/orders" onClick={() => setIsOpen(false)} active={isActive('/orders')}>Orders</MobileNavLink>
                                        <MobileNavLink to="/wishlist" onClick={() => setIsOpen(false)} active={isActive('/wishlist')}>Wishlist</MobileNavLink>
                                        {(isSeller || isAdmin) && (
                                            <MobileNavLink
                                                to={isAdmin ? "/admin" : "/seller"}
                                                onClick={() => setIsOpen(false)}
                                                highlight
                                            >
                                                {isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}
                                            </MobileNavLink>
                                        )}
                                    </>
                                )}
                                <MobileNavLink to="/about" onClick={() => setIsOpen(false)} active={isActive('/about')}>About</MobileNavLink>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        {children}
    </Link>
);

const MenuItem = ({ to, icon: Icon, children, onClick, highlight }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${highlight
            ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
    >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{children}</span>
    </Link>
);

const MobileNavLink = ({ to, children, onClick, active, highlight }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-3 rounded-xl transition-all duration-200 ${highlight
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            : active
                ? 'bg-white/10 text-white font-medium'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        {children}
    </Link>
);

export default Navbar;
