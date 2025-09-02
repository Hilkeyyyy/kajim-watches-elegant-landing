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
        bgClass: 'bg-gradient-to-r from-slate-500/30 to-gray-500/30',
        borderClass: 'border-slate-400/30',
        icon: '✗'
      };
    }
    
    if (stockQuantity <= 5) {
      return {
        label: `Últimas ${stockQuantity}`,
        bgClass: 'bg-gradient-to-r from-amber-500/30 to-orange-500/30',
        borderClass: 'border-amber-400/30',
        icon: '⚡'
      };
    }
    
    return {
      label: `Estoque (${stockQuantity})`,
      bgClass: 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30',
      borderClass: 'border-emerald-400/30',
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