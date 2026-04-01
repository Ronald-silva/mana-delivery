import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/data/menuData';
import { formatPrice } from '@/utils/formatPrice';

interface CartItemRowProps {
  item: CartItem;
  index: number;
  onUpdateQuantity: (itemId: string, quantity: number, size?: 'grande' | 'familia') => void;
  onRemoveFromCart: (itemId: string, size?: 'grande' | 'familia') => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  index,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  const getCategoryEmoji = () => {
    const emojiMap: { [key: string]: string } = {
      'sanduiches': '🥪',
      'pizzas': '🍕',
      'pasteis': '🥟',
      'bebidas': '🥤',
      'combos': '🍔',
      'adicionais': '➕'
    };
    return emojiMap[item.category] || '🍽️';
  };

  return (
    <div 
      className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up border border-gray-100"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex gap-4">
        {/* Product Image/Icon */}
        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <span className="text-4xl">{getCategoryEmoji()}</span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              {item.size && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {item.size === 'grande' ? 'Grande' : 'Família'}
                </span>
              )}
            </div>
            
            {/* Delete Button */}
            <button
              onClick={() => onRemoveFromCart(item.id, item.size)}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
              aria-label="Remover item"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.size)}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.quantity <= 1}
                aria-label="Diminuir quantidade"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.size)}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Aumentar quantidade"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-xs text-gray-500">Subtotal</div>
              <div className="font-bold text-lg bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                {formatPrice(item.selectedPrice * item.quantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
