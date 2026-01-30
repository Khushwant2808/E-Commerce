import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [isAuthenticated]);

    const fetchCart = async (showLoading = true) => {
        if (!isAuthenticated) return;

        try {
            if (showLoading) setLoading(true);
            const { data } = await cartAPI.get();
            setCart(data || []);
        } catch (error) {
            // Silent fail for cart fetch - don't show error to user
            console.error('Failed to fetch cart:', error);
            setCart([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const incrementItem = async (productId) => {
        try {
            await cartAPI.increment({ productId });
            await fetchCart(false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            toast.error(message);
            console.error('Increment item error:', error);
        }
    };

    const decrementItem = async (productId) => {
        try {
            await cartAPI.decrement({ productId });
            await fetchCart(false);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            toast.error(message);
            console.error('Decrement item error:', error);
        }
    };

    const updateCart = async (productId, newQuantity) => {
        const item = cart.find(i => i.productId === productId);
        if (!item) return;

        if (newQuantity === 0) {
            await removeFromCart(productId);
            return;
        }

        if (newQuantity > item.quantity) {
            await incrementItem(productId);
        } else if (newQuantity < item.quantity) {
            await decrementItem(productId);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await cartAPI.add({ productId, quantity });
            toast.success('Added to cart');
            await fetchCart(false);
        } catch (error) {
            toast.error('Failed to add to cart');
            console.error('Add to cart error:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await cartAPI.remove({ productId });
            await fetchCart(false);
            toast.success('Item removed from cart');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item';
            toast.error(message);
            console.error('Remove from cart error:', error);
        }
    };

    const clearCart = async () => {
        // Implementation might need to change if we want a clear endpoint, 
        // but looping remove is fine for now provided it waits.
        // Parallelizing requests might be better.
        try {
            await Promise.all(cart.map(item => cartAPI.remove({ productId: item.productId })));
            setCart([]);
            await fetchCart(false);
        } catch (error) {
            console.error('Clear cart error:', error);
        }
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.Product?.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateCart,
            removeFromCart,
            incrementItem,
            decrementItem,
            clearCart,
            fetchCart,
            totalItems,
            totalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
