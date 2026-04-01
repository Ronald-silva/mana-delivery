import { CheckoutFormData } from '@/types/checkout';
import { Truck, Store } from 'lucide-react';

interface DeliverySectionProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Tipo de Entrega
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Delivery Option */}
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="delivery"
              checked={formData.deliveryType === 'delivery'}
              onChange={(e) => setFormData({...formData, deliveryType: e.target.value as 'delivery' | 'retirada'})}
              className="sr-only"
            />
            <div className={`
              flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
              ${formData.deliveryType === 'delivery'
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              }
            `}>
              <div className={`mb-2 p-2 rounded-full transition-colors ${
                formData.deliveryType === 'delivery' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
              }`}>
                <Truck size={20} />
              </div>
              <span className={`text-sm font-bold ${
                formData.deliveryType === 'delivery' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Delivery
              </span>
            </div>
          </label>

          {/* Retirada Option */}
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="retirada"
              checked={formData.deliveryType === 'retirada'}
              onChange={(e) => setFormData({...formData, deliveryType: e.target.value as 'delivery' | 'retirada'})}
              className="sr-only"
            />
            <div className={`
              flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
              ${formData.deliveryType === 'retirada'
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              }
            `}>
              <div className={`mb-2 p-2 rounded-full transition-colors ${
                formData.deliveryType === 'retirada' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
              }`}>
                <Store size={20} />
              </div>
              <span className={`text-sm font-bold ${
                formData.deliveryType === 'retirada' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Retirada
              </span>
            </div>
          </label>
        </div>
      </div>

      {formData.deliveryType === 'delivery' && (
        <>
          <div>
            <label htmlFor="checkout-address" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Endereço *
            </label>
            <input
              id="checkout-address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-gray-100 placeholder-gray-400"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div>
            <label htmlFor="checkout-neighborhood" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Bairro *
            </label>
            <input
              id="checkout-neighborhood"
              type="text"
              required
              value={formData.neighborhood}
              onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-gray-100 placeholder-gray-400"
              placeholder="Seu bairro"
            />
          </div>
        </>
      )}
    </>
  );
};

export default DeliverySection;
