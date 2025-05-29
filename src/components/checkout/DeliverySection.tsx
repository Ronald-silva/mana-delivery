
import React from 'react';
import { CheckoutFormData } from '@/types/checkout';

interface DeliverySectionProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-3 text-gray-700">Tipo de Entrega</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="delivery"
              checked={formData.deliveryType === 'delivery'}
              onChange={(e) => setFormData({...formData, deliveryType: e.target.value as 'delivery' | 'retirada'})}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">Delivery</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="retirada"
              checked={formData.deliveryType === 'retirada'}
              onChange={(e) => setFormData({...formData, deliveryType: e.target.value as 'delivery' | 'retirada'})}
              className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">Retirada</span>
          </label>
        </div>
      </div>

      {formData.deliveryType === 'delivery' && (
        <>
          <div>
            <label htmlFor="checkout-address" className="block text-sm font-medium mb-2 text-gray-700">
              Endereço *
            </label>
            <input
              id="checkout-address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div>
            <label htmlFor="checkout-neighborhood" className="block text-sm font-medium mb-2 text-gray-700">
              Bairro *
            </label>
            <input
              id="checkout-neighborhood"
              type="text"
              required
              value={formData.neighborhood}
              onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Seu bairro"
            />
          </div>
        </>
      )}
    </>
  );
};

export default DeliverySection;
