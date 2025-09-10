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
        return 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm';
      case 'ESGOTADO':
        return 'bg-gradient-to-r from-stone-600/90 to-stone-500/90 text-white border-stone-300/40 shadow-lg backdrop-blur-sm';
      case 'LIMITADO':
        return 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white border-purple-300/40 shadow-lg backdrop-blur-sm';
      case 'NOVIDADE':
        return 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white border-emerald-300/40 shadow-lg backdrop-blur-sm';
      case 'DESTAQUE':
      case 'EXCLUSIVO':
      case 'LUXO':
        return 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm';
      case 'OFERTA EXCLUSIVA':
        return 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm';
      // Badges de marca padronizados
      case 'ROLEX':
        return 'bg-gradient-to-r from-emerald-700/90 to-emerald-600/90 text-white border-emerald-300/40 shadow-lg backdrop-blur-sm';
      case 'TAG HEUER':
      case 'TAGHEUER':
        return 'bg-gradient-to-r from-red-700/90 to-red-600/90 text-white border-red-300/40 shadow-lg backdrop-blur-sm';
      case 'BULOVA':
        return 'bg-gradient-to-r from-blue-700/90 to-blue-600/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm';
      case 'OMEGA':
        return 'bg-gradient-to-r from-orange-700/90 to-orange-600/90 text-white border-orange-300/40 shadow-lg backdrop-blur-sm';
      case 'TISSOT':
        return 'bg-gradient-to-r from-gray-700/90 to-gray-600/90 text-white border-gray-300/40 shadow-lg backdrop-blur-sm';
      case 'SEIKO':
        return 'bg-gradient-to-r from-indigo-700/90 to-indigo-600/90 text-white border-indigo-300/40 shadow-lg backdrop-blur-sm';
      case 'CITIZEN':
        return 'bg-gradient-to-r from-teal-700/90 to-teal-600/90 text-white border-teal-300/40 shadow-lg backdrop-blur-sm';
      default:
        return 'bg-gradient-to-r from-slate-600/90 to-slate-500/90 text-white border-slate-300/40 shadow-lg backdrop-blur-sm';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getPremiumBadgeStyle(badge)} ${className}`}
    >
      {badge}
    </Badge>
  );
};