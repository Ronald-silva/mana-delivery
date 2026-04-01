import React, { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { ShoppingCart, Check } from 'lucide-react';

const CartToast = () => {
  const { isItemAdded, lastAddedItem } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isItemAdded && lastAddedItem) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isItemAdded, lastAddedItem]);

  if (!visible || !lastAddedItem) return null;

  const itemName = lastAddedItem.name;
  const itemQuantity = lastAddedItem.quantity;
  const itemPrice = formatPrice(lastAddedItem.selectedPrice * lastAddedItem.quantity);
  const itemSize = lastAddedItem.size ? 
    ` (${lastAddedItem.size === 'grande' ? 'Grande' : 'Família'})` : 
    '';

  return (
    <div 
      className={`cart-toast ${visible ? 'show' : ''} flex items-center gap-3 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300`}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="bg-green-500 h-full w-2 self-stretch"></div>
      <div className="bg-green-500 text-white p-2 rounded-full">
        <Check size={18} />
      </div>
      <div className="py-3 pr-4">
        <div className="text-sm font-medium text-gray-800">Item adicionado ao carrinho!</div>
        <div className="text-xs text-gray-600">{itemQuantity}x {itemName}{itemSize}</div>
        <div className="text-xs font-semibold text-primary">{itemPrice}</div>
      </div>
    </div>
  );
};

export default CartToast;
