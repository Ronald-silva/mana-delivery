import React, { useEffect, useState } from 'react';
import { ShoppingCart, Phone, MapPin, Moon, Sun } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useTheme } from 'next-themes';
import StatusFuncionamento from './StatusFuncionamento';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { getTotalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Top Bar - Informações de Contato */}
      <div className="bg-gradient-to-r from-primary via-orange-600 to-primary text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-center md:justify-between gap-3">
          <div className="flex items-center gap-4">
            <a 
              href="tel:5585986460097" 
              className="flex items-center gap-2 hover:text-orange-100 transition-colors"
            >
              <Phone size={14} />
              <span className="font-medium">(85) 98646-0097</span>
            </a>
            <div className="hidden sm:flex items-center gap-2">
              <MapPin size={14} />
              <span>Serrinha, Fortaleza</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <span className="font-semibold">🔥 Peça agora e receba quentinho!</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-premium dark:shadow-premium-dark border-b border-white/50 dark:border-zinc-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Nome */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary to-orange-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="/image/logo.png" 
                    alt="Logo Sanduíche do Chefe" 
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 leading-none tracking-wide">
                  Sanduíche do Chefe
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-2">
                  Sabor que conquista 🍔
                  <span className="lg:hidden scale-75 origin-left">
                    <StatusFuncionamento />
                  </span>
                </p>
              </div>
            </div>

            {/* Status de Funcionamento */}
            <div className="hidden lg:block">
               <StatusFuncionamento />
            </div>

            {/* Actions (Theme + Cart) */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 md:p-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}

              {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative group"
              aria-label={`Ver carrinho com ${totalItems} itens`}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-primary to-orange-600 text-white px-4 md:px-6 py-3 md:py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center gap-2 md:gap-3">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium opacity-90">Meu Pedido</div>
                    <div className="text-sm font-bold leading-none">
                      {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                    </div>
                  </div>
                  {totalItems > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse-glow">
                      {totalItems > 99 ? '99+' : totalItems}
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </header>
    </>
  );
};

export default Header;
