
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface FloatingCartProps {
  onCartClick: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ onCartClick }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-5 w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center border-2 border-white"
      style={{
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(255, 152, 0, 0.3)',
      }}
    >
      <ShoppingCart size={20} className="md:w-6 md:h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center animate-pulse shadow-lg">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default FloatingCart;
