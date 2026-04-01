import { createContext } from 'react';
import { CartItem } from '@/data/menuData';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string, size?: 'grande' | 'familia') => void;
  updateQuantity: (itemId: string, quantity: number, size?: 'grande' | 'familia') => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  lastAddedItem: CartItem | null;
  isItemAdded: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
