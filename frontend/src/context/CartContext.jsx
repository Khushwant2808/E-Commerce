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

    const fetchCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const { data } = await cartAPI.get();
            setCart(data || []);
        } catch (error) {
            // Silent fail for cart fetch - don't show error to user
            console.error('Failed to fetch cart:', error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const updateCart = async (productId, newQuantity) => {
        try {
            await cartAPI.update({ productId, quantity: newQuantity });
            await fetchCart();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update cart';
            toast.error(message);
            console.error('Update cart error:', error);
        }
    };

    // This `addToCart` function was incomplete and malformed in the original snippet.
    // I'm reconstructing it based on the surrounding code.
    const addToCart = async (productId) => {
        try {
            const existingItem = cart.find(item => item.productId === productId);
            await updateCart(productId, existingItem ? existingItem.quantity + 1 : 1);
            toast.success('Added to cart');
        } catch (error) {
            toast.error('Failed to add to cart');
            console.error('Add to cart error:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await cartAPI.update({ productId, quantity: 0 });
            await fetchCart();
            toast.success('Item removed from cart');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to remove item';
            toast.error(message);
            console.error('Remove from cart error:', error);
        }
    };

    const clearCart = async () => {
        for (const item of cart) {
            await updateCart(item.productId, 0);
        }
        setCart([]);
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
