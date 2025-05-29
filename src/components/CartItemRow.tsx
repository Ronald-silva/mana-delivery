
import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem } from '@/data/menuData';

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
  onRemoveFromCart 
}) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div key={`${item.id}-${item.size}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        {item.size && (
          <p className="text-sm text-gray-600 capitalize">Tamanho: {item.size}</p>
        )}
        <p className="text-primary font-bold">{formatPrice(item.selectedPrice)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.size)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.size)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => onRemoveFromCart(item.id, item.size)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
