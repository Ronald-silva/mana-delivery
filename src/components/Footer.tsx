import React from 'react';
import { Phone, MapPin, Clock, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
                <img 
                  src="/image/logo.png" 
                  alt="Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="font-display text-2xl text-primary">
                Sanduíche do Chefe
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Servindo os melhores sanduíches, pizzas e pastéis da região com ingredientes frescos e muito sabor.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/sanduiche_do_chef"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-primary p-2 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4 text-primary">Contato</h4>
            <div className="space-y-3">
              <a
                href="tel:5585986460097"
                className="flex items-start gap-3 text-gray-400 hover:text-primary transition-colors group"
              >
                <Phone size={18} className="mt-1 flex-shrink-0 group-hover:animate-wiggle" />
                <div>
                  <div className="text-sm text-gray-500">Telefone</div>
                  <div className="font-semibold text-white">(85) 98646-0097</div>
                </div>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-500">Localização</div>
                  <div className="font-semibold text-white">Rua Dr. Justa Araújo, 855 - Fortaleza</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hours Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4 text-primary">Horário</h4>
            <div className="flex items-start gap-3 text-gray-400">
              <Clock size={18} className="mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500">Domingo a Sexta</div>
                  <div className="font-semibold text-white">17:00 - 02:00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sábado</div>
                  <div className="font-semibold text-white">17:00 - 04:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4 text-primary">Menu</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Voltar ao Topo
                </button>
              </li>
              <li>
                <a 
                  href="tel:5585986460097" 
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  Fazer Pedido
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/message/SDCUSKXWGX42L1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full group-hover:w-2 transition-all"></span>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Sanduíche do Chefe.</span>
            <span className="hidden md:inline">Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>By</span>
            <a 
              href="https://ronaldigital.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-orange-600 transition-colors"
            >
              RonalDigital
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-primary via-orange-600 to-primary"></div>
    </footer>
  );
};

export default Footer;
