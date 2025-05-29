
import React from 'react';
import { CheckoutFormData } from '@/types/checkout';

interface PaymentSectionProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-3 text-gray-700">Forma de Pagamento</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="dinheiro"
              checked={formData.paymentMethod === 'dinheiro'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">Dinheiro</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="cartao"
              checked={formData.paymentMethod === 'cartao'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">Cartão</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="pix"
              checked={formData.paymentMethod === 'pix'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">PIX</span>
          </label>
        </div>
      </div>

      {formData.paymentMethod === 'dinheiro' && (
        <div>
          <label htmlFor="checkout-change" className="block text-sm font-medium mb-2 text-gray-700">
            Troco para (opcional)
          </label>
          <input
            id="checkout-change"
            type="text"
            value={formData.changeFor}
            onChange={(e) => setFormData({...formData, changeFor: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="R$ 50,00"
          />
        </div>
      )}
    </>
  );
};

export default PaymentSection;
