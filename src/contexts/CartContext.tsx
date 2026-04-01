import React, { useState, ReactNode, useEffect } from 'react';
import { CartItem } from '@/data/menuData';
import { CartContext } from './CartContextDefinition';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isItemAdded, setIsItemAdded] = useState(false);

  // Salvar carrinho no localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);
    }
  }, []);

  // Atualizar localStorage quando o carrinho mudar
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cartItems]);

  // Reset do indicador visual após um tempo
  useEffect(() => {
    if (isItemAdded) {
      const timer = setTimeout(() => {
        setIsItemAdded(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isItemAdded]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === newItem.id && item.size === newItem.size
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });

    // Registrar o último item adicionado para feedback visual
    setLastAddedItem(newItem);
    setIsItemAdded(true);
  };

  const removeFromCart = (itemId: string, size?: 'grande' | 'familia') => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === itemId && item.size === size))
    );
  };

  const updateQuantity = (itemId: string, quantity: number, size?: 'grande' | 'familia') => {
    if (quantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        lastAddedItem,
        isItemAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
