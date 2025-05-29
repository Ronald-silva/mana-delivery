
import React from 'react';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center h-16">
          {/* Logo e Nome Centralizados */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
              <img 
                src="/lovable-uploads/logo.png" 
                alt="Sanduíche do Chefe" 
                className="w-15 h-15 rounded-full object-cover"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-wide">SANDUÍCHE DO CHEFE</h1>
              <p className="text-sm text-orange-100 font-medium">Pizzaria & Lanchonete</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
