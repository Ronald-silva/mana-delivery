
import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItemRow from './CartItemRow';
import CheckoutForm from './CheckoutForm';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  if (showCheckout) {
    return <CheckoutForm onBack={() => setShowCheckout(false)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary" />
            Seu Pedido
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <CartItemRow
                  key={`${item.id}-${item.size}-${index}`}
                  item={item}
                  index={index}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
              >
                Limpar Carrinho
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
