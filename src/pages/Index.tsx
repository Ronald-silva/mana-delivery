
import React, { useState } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import CartModal from '@/components/CartModal';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <Menu />
        <Footer />
        <FloatingCart onCartClick={() => setIsCartOpen(true)} />
        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </CartProvider>
  );
};

export default Index;
