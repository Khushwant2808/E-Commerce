import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log outgoing requests for debugging
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        // Log successful responses
        console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        // Log error responses with details
        if (error.response) {
            console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
                status: error.response.status,
                message: error.response.data?.message || 'Unknown error',
                data: error.response.data
            });

            // Handle 401 Unauthorized - redirect to login
            if (error.response.status === 401 && !error.config.url.includes('/login')) {
                console.warn('[Auth] Unauthorized - redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else {
            console.error('[API Network Error]', error.message);
        }
        return Promise.reject(error);
    }
);

// ==========================================
// AUTHENTICATION APIS
// ==========================================
export const authAPI = {
    // POST /api/auth/register
    register: (data) => {
        console.log('[Auth] Registering user:', data.email);
        return api.post('/auth/register', data);
    },

    // POST /api/auth/login
    login: (data) => {
        console.log('[Auth] Logging in user:', data.email);
        return api.post('/auth/login', data);
    },

    // GET /api/auth/profile
    getProfile: () => {
        console.log('[Auth] Fetching user profile');
        return api.get('/auth/profile');
    },

    // PUT /api/auth/update-profile
    updateProfile: (data) => {
        console.log('[Auth] Updating user profile');
        return api.put('/auth/update-profile', data);
    },

    // PUT /api/auth/become-seller
    becomeSeller: () => {
        console.log('[Auth] Upgrading user to seller');
        return api.put('/auth/become-seller');
    },
};

// ==========================================
// PRODUCT APIS
// ==========================================
export const productAPI = {
    // GET /api/products with query params
    getAll: (params = {}) => {
        console.log('[Products] Fetching products with filters:', params);
        return api.get('/products', { params });
    },

    // GET /api/products/:id
    getById: (id) => {
        console.log('[Products] Fetching product:', id);
        return api.get(`/products/${id}`);
    },

    // GET /api/products/show (seller's own products)
    getMyProducts: () => {
        console.log('[Products] Fetching seller products');
        return api.get('/products/show');
    },

    // POST /api/products (seller only)
    create: (data) => {
        console.log('[Products] Creating product:', data.name);
        return api.post('/products', data);
    },

    // PUT /api/products/meta (update price, description, imageUrl, isActive, isFeatured)
    updateMeta: (data) => {
        console.log('[Products] Updating product metadata:', data.id);
        return api.put('/products/meta', data);
    },

    // PUT /api/products/stock  
    updateStock: (data) => {
        console.log('[Products] Updating product stock:', data.id, 'to', data.stock);
        return api.put('/products/stock', data);
    },

    // DELETE /api/products/:id
    delete: (id) => {
        console.log('[Products] Deleting product:', id);
        return api.delete(`/products/${id}`);
    },
};

// ==========================================
// CONTACT APIS
// ==========================================
export const contactAPI = {
    // POST /api/contact
    submit: (data) => {
        console.log('[Contact] Submitting contact form');
        return api.post('/contact', data);
    },

    // GET /api/contact/my
    getMyMessages: () => {
        console.log('[Contact] Fetching user\'s contact messages');
        return api.get('/contact/my');
    },
};

// ==========================================
// CART APIS
// ==========================================
export const cartAPI = {
    // GET /api/cart
    get: () => {
        console.log('[Cart] Fetching cart items');
        return api.get('/cart');
    },

    // POST /api/cart/add
    add: (data) => {
        console.log('[Cart] Adding to cart:', data);
        return api.post('/cart/add', data);
    },

    // POST /api/cart/remove
    remove: (data) => {
        console.log('[Cart] Removing from cart:', data);
        return api.post('/cart/remove', data);
    },

    // PUT /api/cart/increment
    increment: (data) => {
        console.log('[Cart] Incrementing item:', data);
        return api.put('/cart/increment', data);
    },

    // PUT /api/cart/decrement
    decrement: (data) => {
        console.log('[Cart] Decrementing item:', data);
        return api.put('/cart/decrement', data);
    },
};

// ==========================================
// WISHLIST APIS  
// ==========================================
export const wishlistAPI = {
    // GET /api/wish
    get: () => {
        console.log('[Wishlist] Fetching wishlist');
        return api.get('/wish');
    },

    // POST /api/wish (add to wishlist)
    toggle: (data) => {
        console.log('[Wishlist] Adding to wishlist:', data.productId);
        return api.post('/wish', data);
    },

    // DELETE /api/wish/:productId (remove from wishlist)
    remove: (productId) => {
        console.log('[Wishlist] Removing from wishlist:', productId);
        return api.delete(`/wish/${productId}`);
    },
};

// ==========================================
// ORDER APIS
// ==========================================
export const orderAPI = {
    // POST /api/orders (place new order from cart)
    create: (data) => {
        console.log('[Orders] Placing order');
        return api.post('/orders', data);
    },

    // GET /api/orders (get user's orders)
    getAll: () => {
        console.log('[Orders] Fetching all orders');
        return api.get('/orders');
    },

    // GET /api/orders/:id
    getById: (id) => {
        console.log('[Orders] Fetching order:', id);
        return api.get(`/orders/${id}`);
    },

    // PUT /api/orders/:id/cancel
    cancel: (id) => {
        console.log('[Orders] Cancelling order:', id);
        return api.put(`/orders/${id}/cancel`);
    },

    // PUT /api/orders/:id/status (seller only - update order status)
    updateStatus: (id, status) => {
        console.log('[Orders] Updating order status:', id, 'to', status);
        return api.put(`/orders/${id}/status`, { status });
    },

    // PUT /api/orders/items/:itemId/status (seller only - ship/deliver items)
    updateItemStatus: (itemId, status) => {
        console.log('[Orders] Updating item status:', itemId, 'to', status);
        return api.put(`/orders/items/${itemId}/status`, { status });
    },

    // GET /api/orders/seller (get orders containing seller's products)
    getSellerOrders: () => {
        console.log('[Orders] Fetching seller orders');
        return api.get('/orders/seller');
    },
};

// ==========================================
// REVIEW APIS
// ==========================================
export const reviewAPI = {
    // GET /api/review/:productId
    getByProduct: (productId) => {
        console.log('[Reviews] Fetching reviews for product:', productId);
        return api.get(`/review/${productId}`);
    },

    // POST /api/review
    create: (data) => {
        console.log('[Reviews] Adding review for product:', data.productId);
        return api.post('/review', data);
    },

    // PUT /api/review
    update: (data) => {
        console.log('[Reviews] Updating review for product:', data.productId);
        return api.put('/review', data);
    },
};

// ==========================================
// ADDRESS APIS
// ==========================================
export const addressAPI = {
    // GET /api/address
    getAll: () => {
        console.log('[Address] Fetching addresses');
        return api.get('/address');
    },

    // POST /api/address
    create: (data) => {
        console.log('[Address] Adding address');
        return api.post('/address', data);
    },

    // PUT /api/address
    update: (data) => {
        console.log('[Address] Updating address:', data.id);
        return api.put('/address', data);
    },
};

// ==========================================
// PHONE NUMBER APIS
// =============================================
export const phoneAPI = {
    // GET /api/number
    get: () => {
        console.log('[Phone] Fetching phone number');
        return api.get('/number');
    },

    // POST /api/number
    add: (data) => {
        console.log('[Phone] Adding phone number');
        return api.post('/number', data);
    },

    // PUT /api/number
    update: (data) => {
        console.log('[Phone] Updating phone number');
        return api.put('/number', data);
    },
};

// ==========================================
// PAYMENT APIS
// ==========================================
export const paymentAPI = {
    // POST /api/payments/init
    initialize: (data) => {
        console.log('[Payment] Initializing payment for order:', data.orderId);
        return api.post('/payments/init', data);
    },

    // POST /api/payments/verify
    verify: (data) => {
        console.log('[Payment] Verifying payment:', data.paymentId);
        return api.post('/payments/verify', data);
    },

    // GET /api/payments/history/:orderId
    getHistory: (orderId) => {
        console.log('[Payment] Fetching payment history for order:', orderId);
        return api.get(`/payments/history/${orderId}`);
    },
};

export default api;
