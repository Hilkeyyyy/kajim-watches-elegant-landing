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
        return 'bg-gradient-to-r from-slate-900/85 to-slate-800/85 text-white border-slate-400/60 shadow-xl shadow-slate-900/40 ring-2 ring-slate-300/20';
      case 'ESGOTADO':
        return 'bg-gradient-to-r from-stone-700/85 to-stone-600/85 text-white border-stone-300/60 shadow-xl shadow-stone-700/40 ring-2 ring-stone-200/20';
      case 'LIMITADO':
        return 'bg-gradient-to-r from-purple-900/85 to-violet-800/85 text-white border-purple-300/60 shadow-xl shadow-purple-900/40 ring-2 ring-purple-200/20';
      case 'NOVIDADE':
        return 'bg-gradient-to-r from-teal-900/85 to-cyan-800/85 text-white border-teal-300/60 shadow-xl shadow-teal-900/40 ring-2 ring-teal-200/20';
      case 'DESTAQUE':
      case 'EXCLUSIVO':
      case 'LUXO':
        return 'bg-gradient-to-r from-indigo-900/85 to-blue-800/85 text-white border-indigo-300/60 shadow-xl shadow-indigo-900/40 ring-2 ring-indigo-200/20';
      case 'OFERTA EXCLUSIVA':
        return 'bg-gradient-to-r from-rose-900/85 to-pink-800/85 text-white border-rose-300/60 shadow-xl shadow-rose-900/40 ring-2 ring-rose-200/20';
      default:
        return 'bg-gradient-to-r from-gray-800/85 to-gray-700/85 text-white border-gray-300/60 shadow-xl shadow-gray-800/40 ring-2 ring-gray-200/20';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-semibold backdrop-blur-xl border ${getPremiumBadgeStyle(badge)} ${className}`}
    >
      {badge}
    </Badge>
  );
};