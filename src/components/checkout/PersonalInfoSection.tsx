
import React from 'react';
import { CheckoutFormData } from '@/types/checkout';

interface PersonalInfoSectionProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label htmlFor="checkout-name" className="block text-sm font-medium mb-2 text-gray-700">
          Nome Completo *
        </label>
        <input
          id="checkout-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <label htmlFor="checkout-phone" className="block text-sm font-medium mb-2 text-gray-700">
          Telefone *
        </label>
        <input
          id="checkout-phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="(85) 99999-9999"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;
