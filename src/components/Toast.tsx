import React, { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  description, 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: Check,
      bgColor: 'bg-secondary',
      iconBg: 'bg-white/20',
      textColor: 'text-white'
    },
    error: {
      icon: X,
      bgColor: 'bg-red-500',
      iconBg: 'bg-white/20',
      textColor: 'text-white'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-orange-500',
      iconBg: 'bg-white/20',
      textColor: 'text-white'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      iconBg: 'bg-white/20',
      textColor: 'text-white'
    }
  };

  const { icon: Icon, bgColor, iconBg, textColor } = config[type];

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
      <div className={`${bgColor} ${textColor} rounded-2xl shadow-premium-lg p-4 min-w-[320px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`${iconBg} p-2 rounded-xl flex-shrink-0`}>
            <Icon size={20} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight mb-1">
              {message}
            </p>
            {description && (
              <p className="text-xs opacity-90 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/40 rounded-full animate-progress"
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
