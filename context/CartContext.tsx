import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartQty as apiUpdateQty, CartItem } from '../api/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (medicine_id: number, quantity?: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  removeMultipleFromCart: (ids: number[]) => Promise<void>;
  updateQty: (id: number, quantity: number) => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setItems([]);
      setTotalPrice(0);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await getCart();
      setItems(res.data);
      setTotalPrice(res.total_price);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (medicine_id: number, quantity: number = 1) => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }
    try {
      setLoading(true);
      await apiAddToCart(medicine_id, quantity);
      await refreshCart();
    } catch (e) {
      console.error('Failed to add to cart', e);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      await apiRemoveFromCart(id);
      await refreshCart();
    } catch (e) {
      console.error('Failed to remove from cart', e);
    }
  };

  const removeMultipleFromCart = async (ids: number[]) => {
    try {
      setLoading(true);
      await Promise.all(ids.map(id => apiRemoveFromCart(id)));
      await refreshCart();
    } catch (e) {
      console.error('Failed to remove multiple from cart', e);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await apiUpdateQty(id, quantity);
      await refreshCart();
    } catch (e) {
      console.error('Failed to update qty', e);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      totalPrice, 
      loading, 
      refreshCart, 
      addToCart, 
      removeFromCart, 
      removeMultipleFromCart,
      updateQty,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
