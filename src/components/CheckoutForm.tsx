
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-down">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-premium-lg animate-scale-in">
        {/* Header fixo */}
        <div className="relative bg-gradient-to-r from-primary via-orange-600 to-orange-700 text-white rounded-t-3xl p-5">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 rounded-t-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Finalizar Pedido</h2>
              <p className="text-white/90 text-sm mt-1">Preencha os dados para continuar</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Fechar modal"
            >
              <X size={24} />
            </button>
          </div>
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
