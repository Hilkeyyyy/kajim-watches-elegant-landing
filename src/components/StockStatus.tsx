import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface StockStatusProps {
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockQuantity?: number;
  className?: string;
}

export const StockStatus = ({ stockStatus, stockQuantity, className }: StockStatusProps) => {
  const getStatusConfig = () => {
    switch (stockStatus) {
      case 'in_stock':
        return {
          label: 'Em Estoque',
          variant: 'default' as const,
          icon: CheckCircle,
          className: 'text-green-700 bg-green-50 border-green-200'
        };
      case 'low_stock':
        return {
          label: 'Estoque Baixo',
          variant: 'secondary' as const,
          icon: AlertTriangle,
          className: 'text-yellow-700 bg-yellow-50 border-yellow-200'
        };
      case 'out_of_stock':
        return {
          label: 'Esgotado',
          variant: 'destructive' as const,
          icon: XCircle,
          className: 'text-red-700 bg-red-50 border-red-200'
        };
      default:
        return {
          label: 'Indisponível',
          variant: 'outline' as const,
          icon: XCircle,
          className: 'text-gray-700 bg-gray-50 border-gray-200'
        };
    }
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
      {stockQuantity !== undefined && stockStatus !== 'out_of_stock' && (
        <span className="ml-1">({stockQuantity})</span>
      )}
    </Badge>
  );
};