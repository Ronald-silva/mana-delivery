import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const StatusFuncionamento: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    let open = false;

    // Horários Instagram: 
    // Dom a Sex: 17:00 - 02:00
    // Sáb: 17:00 - 04:00

    if (day === 6) { // Sábado
      // Sábado abre as 17:00 e vai até as 04:00 de Domingo
      if (currentTime >= 17 || currentTime < 4) {
        open = true;
      }
    } else { // Domingo a Sexta
      // Abre as 17:00 e vai até as 02:00 do dia seguinte
      if (currentTime >= 17 || currentTime < 2) {
        open = true;
      }
    }

    setIsOpen(open);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all animate-pulse-glow ${
      isOpen 
        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
        : 'bg-red-500/10 text-red-500 border border-red-500/20'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
      <span>{isOpen ? 'ABERTO AGORA' : 'FECHADO NO MOMENTO'}</span>
    </div>
  );
};

export default StatusFuncionamento;
