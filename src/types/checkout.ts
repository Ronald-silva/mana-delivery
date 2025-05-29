
export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  deliveryType: 'delivery' | 'retirada';
  paymentMethod: 'dinheiro' | 'cartao' | 'pix';
  changeFor: string;
}

export interface CheckoutFormProps {
  onBack: () => void;
  onClose: () => void;
}
