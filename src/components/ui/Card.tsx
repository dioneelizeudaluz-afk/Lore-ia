import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl
        ${glow ? 'shadow-lg shadow-lore-purple/20 hover:shadow-lore-purple/40' : ''}
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
