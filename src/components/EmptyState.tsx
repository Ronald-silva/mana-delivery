import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up">
      {/* Icon or Emoji */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-3xl shadow-lg">
          {emoji ? (
            <span className="text-7xl">{emoji}</span>
          ) : (
            <Icon size={64} className="text-primary" />
          )}
        </div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
