
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CheckoutFormProps } from '@/types/checkout';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import PersonalInfoSection from './checkout/PersonalInfoSection';
import DeliverySection from './checkout/DeliverySection';
import PaymentSection from './checkout/PaymentSection';
import OrderSummary from './checkout/OrderSummary';

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack, onClose }) => {
  const { formData, setFormData, totalPrice, handleSubmit } = useCheckoutForm(onClose);

  // Auto-focus no primeiro campo quando o modal abre
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('#checkout-name') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const onOrderSubmit = () => {
    // Create a synthetic form event for the handleSubmit function
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header fixo */}
        <div className="sticky top-0 bg-white rounded-t-lg flex items-center justify-between p-4 sm:p-6 border-b shadow-sm z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form onSubmit={onFormSubmit} className="space-y-4 sm:space-y-6">
            <PersonalInfoSection formData={formData} setFormData={setFormData} />
            <DeliverySection formData={formData} setFormData={setFormData} />
            <PaymentSection formData={formData} setFormData={setFormData} />
            
            {/* Espaçamento adicional para garantir que o último campo seja visível */}
            <div className="pb-4"></div>
          </form>
        </div>

        {/* Rodapé fixo */}
        <OrderSummary 
          totalPrice={totalPrice}
          onBack={onBack}
          onSubmit={onOrderSubmit}
        />
      </div>
    </div>
  );
};

export default CheckoutForm;
