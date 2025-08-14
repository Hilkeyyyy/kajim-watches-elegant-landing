import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/utils/badgeUtils";

interface ProductBadgeProps {
  badge: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProductBadge = ({ badge, size = "md", className }: ProductBadgeProps) => {
  return (
    <Badge 
      variant={getBadgeVariant(badge)} 
      className={`text-xs font-medium bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg ${className}`}
    >
      {badge}
    </Badge>
  );
};