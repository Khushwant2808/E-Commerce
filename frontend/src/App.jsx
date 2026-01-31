import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import AddReviewPage from './pages/user/AddReviewPage';
import OrdersPage from './pages/user/OrdersPage';
import WishlistPage from './pages/user/WishlistPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import AddressPage from './pages/user/AddressPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import AddProductPage from './pages/seller/AddProductPage';
import EditProductPage from './pages/seller/EditProductPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                            <Route path="/product/:id/review" element={<ProtectedRoute><AddReviewPage /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                            <Route path="/profile/addresses" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
                        </Route>

                        <Route path="/seller" element={<ProtectedRoute seller><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<SellerDashboard />} />
                            <Route path="products" element={<SellerProducts />} />
                            <Route path="products/add" element={<AddProductPage />} />
                            <Route path="products/:id/edit" element={<EditProductPage />} />
                            <Route path="orders" element={<SellerOrders />} />
                        </Route>

                        <Route path="/admin" element={<ProtectedRoute admin><DashboardLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'rgba(15, 15, 15, 0.95)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                fontSize: '14px',
                                boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.5)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
