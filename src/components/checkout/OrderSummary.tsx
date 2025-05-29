
import React from 'react';

interface OrderSummaryProps {
  totalPrice: number;
  onBack: () => void;
  onSubmit: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, onBack, onSubmit }) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="sticky bottom-0 bg-white rounded-b-lg border-t p-4 sm:p-6 shadow-lg z-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-gray-800">Total:</span>
        <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Voltar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full sm:flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-md"
        >
          Enviar Pedido via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
