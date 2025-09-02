import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StockStatusProps {
  stockStatus?: string;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StockStatus = ({ stockStatus = 'in_stock', quantity, size = "md", className }: StockStatusProps) => {
  const getStatusConfig = () => {
    // Check quantity-based status first
    if (quantity === 0 || stockStatus === 'out_of_stock') {
      return {
        label: 'Esgotado',
        variant: 'outline' as const,
        icon: XCircle,
        className: 'text-stone-200 bg-gradient-to-r from-stone-600/30 to-stone-500/30 border-stone-400/40 backdrop-blur-xl'
      };
    }
    
    if ((quantity && quantity < 5) || stockStatus === 'low_stock') {
      return {
        label: 'Estoque Baixo',
        variant: 'outline' as const,
        icon: AlertTriangle,
        className: 'text-slate-200 bg-gradient-to-r from-slate-700/30 to-slate-600/30 border-slate-500/40 backdrop-blur-xl'
      };
    }
    
    return {
      label: 'Em Estoque',
      variant: 'outline' as const,
      icon: CheckCircle,
      className: 'text-teal-200 bg-gradient-to-r from-teal-800/30 to-cyan-700/30 border-teal-500/40 backdrop-blur-xl'
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={`text-xs font-medium flex items-center gap-1 ${config.className} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
      {quantity !== undefined && stockStatus !== 'out_of_stock' && quantity > 0 && (
        <span className="ml-1">({quantity})</span>
      )}
    </Badge>
  );
};