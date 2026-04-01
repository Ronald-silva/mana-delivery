import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartItemRow from './CartItemRow';
import CheckoutForm from './CheckoutForm';
import { formatPrice } from '@/utils/formatPrice';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  if (showCheckout) {
    return <CheckoutForm onBack={() => setShowCheckout(false)} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-down">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-premium-lg animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary via-orange-600 to-orange-700 text-white p-6">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Seu Pedido</h2>
                <p className="text-white/90 text-sm">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} adicionados
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              aria-label="Fechar modal"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Carrinho Vazio
              </h3>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Você ainda não adicionou nenhum item ao carrinho. Explore nosso cardápio!
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Ver Cardápio
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

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-shrink-0 bg-white border-2 border-gray-200 text-gray-700 p-3 rounded-2xl hover:bg-gray-50 hover:border-red-200 hover:text-red-600 transition-all duration-300 hover:scale-105 shadow-sm"
                aria-label="Limpar carrinho"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setShowCheckout(true)}
                className="flex-1 bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
