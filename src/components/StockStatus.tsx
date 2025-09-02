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
        className: 'text-slate-300 bg-gradient-to-r from-slate-500/20 to-gray-500/20 border-slate-400/30 backdrop-blur-xl'
      };
    }
    
    if ((quantity && quantity < 5) || stockStatus === 'low_stock') {
      return {
        label: 'Estoque Baixo',
        variant: 'outline' as const,
        icon: AlertTriangle,
        className: 'text-amber-200 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30 backdrop-blur-xl'
      };
    }
    
    return {
      label: 'Em Estoque',
      variant: 'outline' as const,
      icon: CheckCircle,
      className: 'text-emerald-200 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/30 backdrop-blur-xl'
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