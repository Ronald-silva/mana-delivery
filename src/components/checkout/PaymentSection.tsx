import { CheckoutFormData } from '@/types/checkout';
import { Banknote, CreditCard, QrCode } from 'lucide-react';

interface PaymentSectionProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ formData, setFormData }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 uppercase tracking-wider">
          Forma de Pagamento
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Dinheiro */}
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="dinheiro"
              checked={formData.paymentMethod === 'dinheiro'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="sr-only"
            />
            <div className={`
              flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 h-full
              ${formData.paymentMethod === 'dinheiro'
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              }
            `}>
              <div className={`mb-1.5 p-1.5 rounded-full transition-colors ${
                formData.paymentMethod === 'dinheiro' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
              }`}>
                <Banknote size={18} />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${
                formData.paymentMethod === 'dinheiro' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Dinheiro
              </span>
            </div>
          </label>

          {/* Cartão */}
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="cartao"
              checked={formData.paymentMethod === 'cartao'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="sr-only"
            />
            <div className={`
              flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 h-full
              ${formData.paymentMethod === 'cartao'
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              }
            `}>
              <div className={`mb-1.5 p-1.5 rounded-full transition-colors ${
                formData.paymentMethod === 'cartao' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
              }`}>
                <CreditCard size={18} />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${
                formData.paymentMethod === 'cartao' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Cartão
              </span>
            </div>
          </label>

          {/* PIX */}
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="pix"
              checked={formData.paymentMethod === 'pix'}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'dinheiro' | 'cartao' | 'pix'})}
              className="sr-only"
            />
            <div className={`
              flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 h-full
              ${formData.paymentMethod === 'pix'
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md ring-1 ring-primary'
                : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-700'
              }
            `}>
              <div className={`mb-1.5 p-1.5 rounded-full transition-colors ${
                formData.paymentMethod === 'pix' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
              }`}>
                <QrCode size={18} />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${
                formData.paymentMethod === 'pix' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
              }`}>
                PIX
              </span>
            </div>
          </label>
        </div>
      </div>

      {formData.paymentMethod === 'dinheiro' && (
        <div>
          <label htmlFor="checkout-change" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Troco para (opcional)
          </label>
          <input
            id="checkout-change"
            type="text"
            value={formData.changeFor}
            onChange={(e) => setFormData({...formData, changeFor: e.target.value})}
            className="w-full p-3.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-gray-100 placeholder-gray-400"
            placeholder="R$ 50,00"
          />
        </div>
      )}
    </>
  );
};

export default PaymentSection;
