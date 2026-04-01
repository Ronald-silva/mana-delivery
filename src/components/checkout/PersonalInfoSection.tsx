
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
        <label htmlFor="checkout-name" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Nome Completo *
        </label>
        <input
          id="checkout-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-gray-100 placeholder-gray-400"
          placeholder="Seu nome completo"
        />
      </div>

      <div>
        <label htmlFor="checkout-phone" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Telefone *
        </label>
        <input
          id="checkout-phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-gray-100 placeholder-gray-400"
          placeholder="(85) 99999-9999"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;
