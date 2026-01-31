import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/update-profile', data),
    becomeSeller: () => api.put('/auth/become-seller'),
};

export const productAPI = {
    getAll: (params = {}) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getMyProducts: () => api.get('/products/show'),
    create: (data) => api.post('/products', data),
    updateMeta: (data) => api.put('/products/meta', data),
    updateStock: (data) => api.put('/products/stock', data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const contactAPI = {
    submit: (data) => api.post('/contact', data),
    getMyMessages: () => api.get('/contact/my'),
};

export const cartAPI = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart/add', data),
    remove: (data) => api.post('/cart/remove', data),
    increment: (data) => api.put('/cart/increment', data),
    decrement: (data) => api.put('/cart/decrement', data),
};

export const wishlistAPI = {
    get: () => api.get('/wish'),
    toggle: (data) => api.post('/wish', data),
    remove: (productId) => api.delete(`/wish/${productId}`),
};

export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.put(`/orders/${id}/cancel`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    updateItemStatus: (itemId, status) => api.put(`/orders/items/${itemId}/status`, { status }),
    getSellerOrders: () => api.get('/orders/seller'),
};

export const reviewAPI = {
    getByProduct: (productId) => api.get(`/review/${productId}`),
    create: (data) => api.post('/review', data),
    update: (data) => api.put('/review', data),
};

export const addressAPI = {
    getAll: () => api.get('/address'),
    create: (data) => api.post('/address', data),
    update: (data) => api.put('/address', data),
};

export const phoneAPI = {
    get: () => api.get('/number'),
    add: (data) => api.post('/number', data),
    update: (data) => api.put('/number', data),
};

export const paymentAPI = {
    initialize: (data) => api.post('/payments/init', data),
    verify: (data) => api.post('/payments/verify', data),
    getHistory: (orderId) => api.get(`/payments/history/${orderId}`),
};

export const adminAPI = {
    getStats: async () => {
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get('/auth/users').catch(() => ({ data: { users: [] } })),
                api.get('/products').catch(() => ({ data: { products: [] } })),
                api.get('/orders/admin/all').catch(() => ({ data: { orders: [] } })),
            ]);

            const users = usersRes.data?.users || [];
            const products = productsRes.data?.products || [];
            const orders = ordersRes.data?.orders || [];

            const totalRevenue = orders.reduce((sum, order) => {
                if (order.status === 'completed' || order.status === 'delivered') {
                    return sum + parseFloat(order.total || 0);
                }
                return sum;
            }, 0);

            return {
                totalUsers: users.length,
                totalProducts: products.length,
                totalOrders: orders.length,
                totalRevenue,
                recentOrders: orders.slice(0, 5),
                recentUsers: users.slice(0, 5),
            };
        } catch (error) {
            throw error;
        }
    },
    getUsers: () => api.get('/auth/users'),
    updateUserRole: (userId, role) => api.put(`/auth/users/${userId}/role`, { role }),
    toggleUserSeller: (userId, canSell) => api.put(`/auth/users/${userId}/seller`, { canSell }),
    deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
    getAllOrders: () => api.get('/orders/admin/all'),
    updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
    getAllProducts: () => api.get('/products'),
    deleteProduct: (productId) => api.delete(`/products/${productId}`),
    getContactMessages: () => api.get('/contact/admin/all'),
};

export default api;
