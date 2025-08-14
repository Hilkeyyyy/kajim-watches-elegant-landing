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
        variant: 'destructive' as const,
        icon: XCircle,
        className: 'text-red-700 bg-red-50 border-red-200'
      };
    }
    
    if ((quantity && quantity < 5) || stockStatus === 'low_stock') {
      return {
        label: 'Estoque Baixo',
        variant: 'secondary' as const,
        icon: AlertTriangle,
        className: 'text-yellow-700 bg-yellow-50 border-yellow-200'
      };
    }
    
    return {
      label: 'Em Estoque',
      variant: 'default' as const,
      icon: CheckCircle,
      className: 'text-green-700 bg-green-50 border-green-200'
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