
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '@/data/menuData';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  item: MenuItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'grande' | 'familia'>('grande');
  const [quantity, setQuantity] = useState(1);

  const hasSizeOptions = item.priceFamily !== undefined;
  const currentPrice = selectedSize === 'familia' ? item.priceFamily! : item.price;

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
      size: hasSizeOptions ? selectedSize : undefined,
      selectedPrice: currentPrice
    };
    
    addToCart(cartItem);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col hover:shadow-lg transition-shadow">
      {/* Imagem placeholder */}
      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
        <span className="text-4xl">
          {item.category === 'sanduiches' ? '🥪' :
           item.category === 'pizzas' ? '🍕' :
           item.category === 'pasteis' ? '🥟' :
           item.category === 'bebidas' ? '🥤' :
           item.category === 'combos' ? '🍔' :
           '🍽️'}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 flex-1">{item.description}</p>

        {/* Seleção de tamanho para pizzas */}
        {hasSizeOptions && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Tamanho:</p>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`size-${item.id}`}
                  value="grande"
                  checked={selectedSize === 'grande'}
                  onChange={(e) => setSelectedSize(e.target.value as 'grande')}
                  className="text-primary"
                />
                <span className="text-sm">Grande - {formatPrice(item.price)}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`size-${item.id}`}
                  value="familia"
                  checked={selectedSize === 'familia'}
                  onChange={(e) => setSelectedSize(e.target.value as 'familia')}
                  className="text-primary"
                />
                <span className="text-sm">Família - {formatPrice(item.priceFamily!)}</span>
              </label>
            </div>
          </div>
        )}

        {/* Preço e controles */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
