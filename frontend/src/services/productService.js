import api from './api';

export const ProductService = {
    getAll: async (params) => {
        const { data } = await api.get('/products', { params });
        return data;
    },

    getOne: async (id) => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    // Seller Methods
    create: async (productData) => {
        const { data } = await api.post('/products', productData);
        return data;
    },

    update: async (id, productData) => {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    },

    updateStock: async (id, stock) => {
        const { data } = await api.put('/products/stock', { productId: id, stock });
        return data;
    },

    delete: async (id) => {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    }
};
