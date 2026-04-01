import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { MenuItem } from '@/data/menuData';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  item: MenuItem;
  onClick: () => void;
}

const ProductCard = ({ item, onClick }: ProductCardProps) => {
  const hasSizeOptions = item.priceFamily !== undefined;
  const basePrice = item.price;

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
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-md hover:shadow-premium-lg transition-all duration-500 overflow-hidden h-full flex flex-col animate-fade-in-up cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${item.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-40 md:h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <img 
          src={getCategoryImage()} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
          {item.category === 'sanduiches' ? 'Sanduíche' :
           item.category === 'pizzas' ? 'Pizza' :
           item.category === 'pasteis' ? 'Pastel' :
           item.category === 'bebidas' ? 'Bebida' :
           item.category === 'combos' ? 'Combo' : 'Adicional'}
        </div>

        {/* Special Badge for Combos */}
        {item.category === 'combos' && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse-glow">
            <Sparkles size={12} />
            <span>Oferta</span>
          </div>
        )}

        {/* Size Options Indicator */}
        {hasSizeOptions && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-primary shadow-md flex items-center gap-1">
            <span>📏</span>
            <span>2 tamanhos</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
          {item.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {hasSizeOptions ? 'A partir de' : 'Preço'}
            </div>
            <span className="text-3xl font-display bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent leading-none">
              {formatPrice(basePrice)}
            </span>
          </div>
          
          {/* Add Button */}
          <div className="relative group/btn">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover/btn:blur-xl transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-primary to-orange-600 text-white p-3 rounded-full shadow-md group-hover/btn:shadow-lg transition-all duration-300 group-hover/btn:scale-110">
              <Plus size={24} />
            </div>
          </div>
        </div>

        {/* Click Hint */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">
            Clique para ver detalhes
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
