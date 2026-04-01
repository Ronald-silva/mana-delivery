import React, { useState } from 'react';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import CartModal from '@/components/CartModal';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <Menu />
      <Footer />
      <FloatingCart onCartClick={() => setIsCartOpen(true)} />
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Index;
