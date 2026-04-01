import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { MenuItem } from '@/data/menuData';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

interface ProductDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<'grande' | 'familia'>('grande');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen || !item) return null;

  const hasSizeOptions = item.priceFamily !== undefined;
  const currentPrice = selectedSize === 'familia' ? item.priceFamily! : item.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
      size: hasSizeOptions ? selectedSize : undefined,
      selectedPrice: currentPrice
    };
    
    addToCart(cartItem);
    setIsAdding(true);
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
      // Reset
      setQuantity(1);
      setSelectedSize('grande');
    }, 800);
  };

  const getCategoryImage = () => {
    if (item.image) return item.image;
    
    // Imagens Premium Fallback (Food Appeal)
    const fallbackMap: { [key: string]: string } = {
      'sanduiches': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
      'pizzas': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
      'pasteis': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80',
      'bebidas': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80',
      'combos': 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=500&q=80',
      'adicionais': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=500&q=80'
    };
    return fallbackMap[item.category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center animate-fade-in-down"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[95vh] md:max-h-[90vh] flex flex-col shadow-premium-lg animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image */}
        <div className="relative w-full h-56 md:h-64 overflow-hidden bg-gray-100 dark:bg-zinc-800">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Fechar"
          >
            <X size={20} className="text-gray-900" />
          </button>

          {/* Product Image */}
          <img 
            src={getCategoryImage()} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

          {/* Category Badge Overlaid */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-800 shadow-lg">
              {item.category === 'sanduiches' ? 'Sanduíche' :
               item.category === 'pizzas' ? 'Pizza' :
               item.category === 'pasteis' ? 'Pastel' :
               item.category === 'bebidas' ? 'Bebida' :
               item.category === 'combos' ? 'Combo' : 'Adicional'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {/* Title and Description */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {item.name}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Size Selection - CONSISTENTE */}
          {hasSizeOptions && (
            <div className="mb-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">
                Escolha o tamanho
              </h3>
              <div className="space-y-2">
                {/* Grande Option */}
                <label className="block cursor-pointer group">
                  <input
                    type="radio"
                    name="size"
                    value="grande"
                    checked={selectedSize === 'grande'}
                    onChange={(e) => setSelectedSize(e.target.value as 'grande')}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedSize === 'grande'
                      ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        selectedSize === 'grande'
                          ? 'border-primary bg-primary'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {selectedSize === 'grande' && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Grande</div>
                        <div className="text-xs text-gray-500">Tamanho tradicional</div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-gray-900">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </label>

                {/* Família Option - CORRIGIDO PARA SER IGUAL */}
                <label className="block cursor-pointer group">
                  <input
                    type="radio"
                    name="size"
                    value="familia"
                    checked={selectedSize === 'familia'}
                    onChange={(e) => setSelectedSize(e.target.value as 'familia')}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedSize === 'familia'
                      ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        selectedSize === 'familia'
                          ? 'border-primary bg-primary'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {selectedSize === 'familia' && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Família</div>
                        <div className="text-xs text-gray-500">Serve mais pessoas</div>
                      </div>
                    </div>
                    <div className="font-bold text-base text-gray-900">
                      {formatPrice(item.priceFamily!)}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">
              Quantidade
            </h3>
            <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-gray-200"
                aria-label="Diminuir quantidade"
              >
                <Minus size={18} />
              </button>
              <div className="text-center min-w-[60px]">
                <div className="text-3xl font-bold text-gray-900 leading-none">{quantity}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {quantity === 1 ? 'un.' : 'uns.'}
                </div>
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-orange-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                aria-label="Aumentar quantidade"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Add to Cart Button */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-3.5 rounded-xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-between px-5 ${
              isAdding
                ? 'bg-secondary text-white scale-105'
                : 'bg-gradient-to-r from-primary to-orange-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isAdding ? (
              <div className="flex items-center gap-2 mx-auto">
                <Check size={20} className="animate-scale-in-center" />
                <span>Adicionado!</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  <span>Adicionar</span>
                </div>
                <span className="font-bold text-lg">
                  {formatPrice(totalPrice)}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
