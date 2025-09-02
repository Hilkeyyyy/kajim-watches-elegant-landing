import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/utils/badgeUtils";

interface ProductBadgeProps {
  badge: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProductBadge = ({ badge, size = "md", className }: ProductBadgeProps) => {
  const getPremiumBadgeStyle = (badge: string) => {
    const normalizedBadge = badge.toUpperCase();
    
    switch (normalizedBadge) {
      case 'OFERTA':
      case 'PROMOCAO':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 border-amber-400/30 shadow-amber-500/20';
      case 'ESGOTADO':
        return 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-200 border-slate-400/30 shadow-slate-500/20';
      case 'LIMITADO':
        return 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-100 border-purple-400/30 shadow-purple-500/20';
      case 'NOVIDADE':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-100 border-emerald-400/30 shadow-emerald-500/20';
      case 'DESTAQUE':
      case 'EXCLUSIVO':
      case 'LUXO':
        return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-100 border-blue-400/30 shadow-blue-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-200 border-slate-400/30 shadow-slate-500/20';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium backdrop-blur-xl border shadow-xl ring-1 ring-white/10 ${getPremiumBadgeStyle(badge)} ${className}`}
    >
      {badge}
    </Badge>
  );
};