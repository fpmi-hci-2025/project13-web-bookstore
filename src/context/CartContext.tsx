import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Cart } from '../types';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const cartData = await cartApi.get();
      // Backend returns { items: [], total_price: number, total_items: number }
      setCart({
        items: cartData?.items || [],
        total: cartData?.total_price ?? cartData?.total ?? 0,
      });
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCart({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, loadCart]);

  const addToCart = async (bookId: string, quantity = 1) => {
    try {
      // Backend returns just the CartItem, not the full cart
      await cartApi.addItem(bookId, quantity);
      // Reload the full cart to get updated items and total
      await loadCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      // Backend returns just the CartItem, not the full cart
      await cartApi.updateItem(itemId, quantity);
      // Reload the full cart
      await loadCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId);
      // Update local state optimistically
      setCart((prev) => {
        if (!prev) return null;
        const items = prev.items.filter((item) => item.id !== itemId);
        const total = items.reduce(
          (sum, item) => sum + (item.book?.price || 0) * item.quantity,
          0
        );
        return { items, total };
      });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
