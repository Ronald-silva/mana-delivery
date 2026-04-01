import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

// Este componente mostra apenas uma seta apontando para o carrinho
// É uma alternativa mais sutil ao toast, complementando o feedback visual
const AddToCartIndicator = () => {
  const { isItemAdded } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isItemAdded) {
      // Pequeno atraso para não aparecer ao mesmo tempo que o feedback no card
      const delayTimer = setTimeout(() => {
        setVisible(true);
      }, 300);

      // Duração menor que o toast para não ficar redundante
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 1200);

      return () => {
        clearTimeout(delayTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isItemAdded]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-9 z-40 animate-fade-in">
      <div className="flex flex-col items-center">
        <ArrowUp
          size={24}
          className="text-orange-500 animate-bounce mb-1"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
        />
      </div>
    </div>
  );
};

export default AddToCartIndicator;
