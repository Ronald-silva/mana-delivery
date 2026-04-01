import React, { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

interface FloatingCartProps {
  onCartClick: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ onCartClick }) => {
  const { getTotalItems, getTotalPrice, cartItems } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const [pulse, setPulse] = useState(false);
  const [countPop, setCountPop] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevItemCount) {
      setPulse(true);
      setCountPop(true);
      
      const pulseTimer = setTimeout(() => setPulse(false), 1000);
      const popTimer = setTimeout(() => setCountPop(false), 500);
      
      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(popTimer);
      };
    }
    setPrevItemCount(totalItems);
  }, [totalItems, cartItems, prevItemCount]);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Mobile Floating Button */}
      <button
        onClick={onCartClick}
        className={`md:hidden fixed bottom-6 right-5 z-40 ${
          pulse ? 'animate-cart-pulse' : ''
        }`}
        aria-label={`Ver carrinho com ${totalItems} itens`}
      >
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl animate-pulse-glow"></div>
          
          {/* Button */}
          <div className="relative bg-gradient-to-br from-primary via-orange-600 to-orange-700 text-white w-16 h-16 rounded-full shadow-premium-lg flex items-center justify-center">
            <ShoppingCart size={24} className="relative z-10" />
            
            {/* Counter Badge */}
            <div className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white ${
              countPop ? 'animate-counter-pop' : ''
            }`}>
              {totalItems > 99 ? '99+' : totalItems}
            </div>
          </div>
        </div>
      </button>

      {/* Desktop Floating Bar */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
        <div className="container mx-auto px-4 pb-6">
          <button
            onClick={onCartClick}
            className={`w-full max-w-2xl mx-auto glass-effect rounded-3xl shadow-premium-lg overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
              pulse ? 'animate-cart-pulse' : ''
            }`}
          >
            <div className="relative bg-gradient-to-r from-primary/95 via-orange-600/95 to-orange-700/95 backdrop-blur-xl">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="relative px-6 py-4 flex items-center justify-between">
                {/* Left Section - Cart Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                      <ShoppingCart size={28} className="text-white" />
                    </div>
                    <div className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white ${
                      countPop ? 'animate-counter-pop' : ''
                    }`}>
                      {totalItems > 99 ? '99+' : totalItems}
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-white/90 text-sm font-medium">
                      {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
                    </div>
                    <div className="text-white text-2xl font-bold">
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                </div>

                {/* Right Section - CTA */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-2 text-white/90 text-sm">
                    <Sparkles size={16} className="animate-pulse" />
                    <span>Clique para finalizar</span>
                  </div>
                  
                  <div className="bg-white text-primary px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                    <span>Ver Pedido</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingCart;
