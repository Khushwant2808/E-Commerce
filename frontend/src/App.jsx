import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

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

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import AddProductPage from './pages/seller/AddProductPage';
import EditProductPage from './pages/seller/EditProductPage';

import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
    return (
        <BrowserRouter>
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
                            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                            <Route path="/product/:id/review" element={<ProtectedRoute><AddReviewPage /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
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
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'rgba(0, 0, 0, 0.9)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
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
