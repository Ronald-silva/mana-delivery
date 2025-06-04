
import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const handleLocationClick = () => {
    const address = "Rua Justa Araújo, 855 - Serrinha";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+5585991993833';
  };

  return (
    <>
      {/* Linha divisória alaranjada */}
      <div className="h-1 bg-primary"></div>
      
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Seção de Localização */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  
                  <button 
                    onClick={handleLocationClick}
                    className="text-gray-300 text-sm hover:text-primary transition-colors cursor-pointer text-center"
                  >
                    Rua Justa Araújo, 855 - Serrinha
                  </button>
                </div>
              </div>
            </div>
            
            {/* Seção de Contato */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3">
                
                
                {/* Horário */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">Aberto das 17h - 01h</span>
                </div>
              </div>
            </div>
            
            {/* Seção de Redes Sociais */}
            <div className="text-center">
              <a
                href="https://www.instagram.com/sanduiche_do_chef/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Siga-nos no Instagram"
              >
                <Instagram size={24} className="text-white" />
              </a>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-xs">
              © 2024 Sanduíche do Chefe.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
