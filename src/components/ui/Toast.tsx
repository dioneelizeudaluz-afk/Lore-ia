import React, { useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: Check,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];
  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-lore-purple/20 border-lore-purple/50 text-lore-purple',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border backdrop-blur-md ${colors[type]}`}>
        <Icon className="w-5 h-5" />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition-opacity"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
