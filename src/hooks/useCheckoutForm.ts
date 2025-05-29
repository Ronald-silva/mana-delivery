
import { useState } from 'react';
import { CheckoutFormData } from '@/types/checkout';
import { useCart } from '@/contexts/CartContext';

export const useCheckoutForm = (onClose: () => void) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    deliveryType: 'delivery',
    paymentMethod: 'dinheiro',
    changeFor: ''
  });

  const totalPrice = getTotalPrice();

  const validateForm = () => {
    if (!formData.name || !formData.phone) {
      alert('Por favor, preencha nome e telefone.');
      return false;
    }

    if (formData.deliveryType === 'delivery' && (!formData.address || !formData.neighborhood)) {
      alert('Por favor, preencha o endereço completo para delivery.');
      return false;
    }

    if (formData.paymentMethod === 'dinheiro' && formData.changeFor) {
      const changeValue = parseFloat(formData.changeFor.replace(',', '.'));
      if (changeValue <= totalPrice) {
        alert('O valor para troco deve ser maior que o total da compra.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const orderItems = cartItems.map(item => 
      `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} - R$ ${(item.selectedPrice * item.quantity).toFixed(2).replace('.', ',')}`
    ).join('\n');

    // Calcular valor do troco se for dinheiro
    let paymentInfo = '';
    if (formData.paymentMethod === 'dinheiro') {
      if (formData.changeFor) {
        const changeValue = parseFloat(formData.changeFor.replace(',', '.'));
        const changeAmount = changeValue - totalPrice;
        paymentInfo = `Dinheiro - Receber R$ ${formData.changeFor} - Troco: R$ ${changeAmount.toFixed(2).replace('.', ',')}`;
      } else {
        paymentInfo = 'Dinheiro - Não precisa de troco';
      }
    } else if (formData.paymentMethod === 'cartao') {
      paymentInfo = 'Cartão';
    } else {
      paymentInfo = 'PIX';
    }

    const orderMessage = `
🍔 *NOVO PEDIDO - SANDUÍCHE DO CHEFE*

👤 *Cliente:* ${formData.name}
📱 *Telefone:* ${formData.phone}

🛍️ *Itens:*
${orderItems}

💰 *Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}

📍 *Entrega:* ${formData.deliveryType === 'delivery' ? `Delivery - ${formData.address}, ${formData.neighborhood}` : 'Retirada no local'}

💳 *Pagamento:* ${paymentInfo}
    `.trim();

    const whatsappNumber = '5585986460097';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  return {
    formData,
    setFormData,
    totalPrice,
    handleSubmit
  };
};
