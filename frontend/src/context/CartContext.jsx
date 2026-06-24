import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await cartAPI.get();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.addItem(productId, quantity);
    setCart(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await cartAPI.updateItem(itemId, quantity);
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    const res = await cartAPI.removeItem(itemId);
    setCart(res.data);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount: cart?.total_items || 0,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
