import { Badge } from "@/components/ui/badge";

interface ProductBadgeProps {
  badge: string;
  className?: string;
}

export const ProductBadge = ({ badge, className }: ProductBadgeProps) => {
  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'novo':
      case 'new':
        return 'default';
      case 'oferta':
      case 'sale':
        return 'destructive';
      case 'limitado':
      case 'limited':
        return 'secondary';
      case 'destaque':
      case 'featured':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant(badge)} 
      className={`text-xs font-medium ${className}`}
    >
      {badge}
    </Badge>
  );
};