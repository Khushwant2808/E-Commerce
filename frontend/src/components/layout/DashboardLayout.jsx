import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    Menu,
    X,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isAdmin } = useAuth();
    const location = useLocation();

    const sellerLinks = [
        { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/seller/products', icon: Package, label: 'Products' },
        { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
    ];

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    ];

    const links = isAdmin ? adminLinks : sellerLinks;

    return (
        <div className="min-h-screen flex">
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: isSidebarOpen ? 0 : -280 }}
                className="fixed left-0 top-0 h-full w-70 glass border-r border-white/10 z-40"
            >
                <div className="p-6">
                    <Link to="/" className="flex items-center space-x-2 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">
                            {isAdmin ? 'Admin' : 'Seller'}
                        </span>
                    </Link>

                    <nav className="space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.to;

                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white'
                                            : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Back to Store</span>
                    </Link>
                </div>
            </motion.aside>

            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-70' : 'ml-0'}`}>
                <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="glass px-4 py-2 rounded-lg flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold">Sales Today: $0</span>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
