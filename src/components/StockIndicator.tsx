import React from 'react';

interface StockIndicatorProps {
  stockQuantity: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ 
  stockQuantity, 
  className = "",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const getStatusConfig = () => {
    if (stockQuantity === 0) {
      return {
        label: 'Esgotado',
        bgClass: 'bg-gradient-to-r from-red-500/90 to-rose-500/90',
        borderClass: 'border-red-400/30',
        icon: '✗'
      };
    }
    
    if (stockQuantity <= 5) {
      return {
        label: `Últimas ${stockQuantity}`,
        bgClass: 'bg-gradient-to-r from-amber-500/90 to-orange-500/90',
        borderClass: 'border-amber-400/30',
        icon: '⚡'
      };
    }
    
    return {
      label: `Estoque (${stockQuantity})`,
      bgClass: 'bg-gradient-to-r from-primary/80 to-accent/80 backdrop-blur-lg',
      borderClass: 'border-primary/20',
      icon: '✓'
    };
  };

  const config = getStatusConfig();

  return (
    <div className={`
      ${config.bgClass} 
      ${config.borderClass}
      ${sizeClasses[size]}
      text-white font-semibold rounded-full shadow-xl border backdrop-blur-xl
      flex items-center gap-1.5 whitespace-nowrap
      ring-1 ring-white/10 shadow-lg
      ${className}
    `}>
      <span className="flex items-center gap-1">
        {config.icon} {config.label}
      </span>
    </div>
  );
};