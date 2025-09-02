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
        return 'bg-gradient-to-r from-slate-800/30 to-slate-700/30 text-slate-200 border-slate-500/40 shadow-slate-800/30';
      case 'ESGOTADO':
        return 'bg-gradient-to-r from-stone-600/30 to-stone-500/30 text-stone-200 border-stone-400/40 shadow-stone-600/30';
      case 'LIMITADO':
        return 'bg-gradient-to-r from-purple-800/30 to-violet-700/30 text-purple-200 border-purple-500/40 shadow-purple-800/30';
      case 'NOVIDADE':
        return 'bg-gradient-to-r from-teal-800/30 to-cyan-700/30 text-teal-200 border-teal-500/40 shadow-teal-800/30';
      case 'DESTAQUE':
      case 'EXCLUSIVO':
      case 'LUXO':
        return 'bg-gradient-to-r from-indigo-800/30 to-blue-700/30 text-indigo-200 border-indigo-500/40 shadow-indigo-800/30';
      case 'OFERTA EXCLUSIVA':
        return 'bg-gradient-to-r from-rose-800/30 to-pink-700/30 text-rose-200 border-rose-500/40 shadow-rose-800/30';
      default:
        return 'bg-gradient-to-r from-stone-600/30 to-stone-500/30 text-stone-200 border-stone-400/40 shadow-stone-600/30';
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