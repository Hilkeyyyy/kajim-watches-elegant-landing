import { Product } from "@/types/product";

export interface BadgeInfo {
  text: string;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
  priority: number; // Quanto menor, maior a prioridade
}

export const getBadgeVariant = (badge: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (badge.toLowerCase()) {
    case 'novo':
    case 'new':
      return 'default';
    case 'oferta':
    case 'sale':
      return 'destructive';
    case 'limitado':
    case 'limited':
    case 'esgotado':
    case 'out_of_stock':
      return 'secondary';
    case 'destaque':
    case 'featured':
      return 'outline';
    case 'exclusivo':
    case 'exclusive':
      return 'outline';
    default:
      return 'outline';
  }
};

export const generateAutoBadges = (product: Product): BadgeInfo[] => {
  const badges: BadgeInfo[] = [];
  
  // Badge de estoque esgotado (prioridade máxima)
  if (product.stock_status === 'out_of_stock' || product.stock_quantity === 0) {
    badges.push({
      text: 'Esgotado',
      variant: 'secondary',
      priority: 1
    });
  }
  
  // Badge de produto novo - removido pois Product não tem created_at
  // Esta funcionalidade será implementada quando buscarmos dados do Supabase
  
  // Badge de destaque
  if (product.is_featured) {
    badges.push({
      text: 'Destaque',
      variant: 'outline',
      priority: 3
    });
  }
  
  // Badge de limitado (estoque baixo mas não zerado)
  if (product.stock_quantity && product.stock_quantity > 0 && product.stock_quantity <= 5) {
    badges.push({
      text: 'Limitado',
      variant: 'secondary',
      priority: 4
    });
  }
  
  return badges;
};

export const getDisplayBadges = (product: Product, maxBadges: number = 2): string[] => {
  // Primeiro, pega badges automáticas
  const autoBadges = generateAutoBadges(product);
  
  // Depois, adiciona badges manuais do produto
  const manualBadges: BadgeInfo[] = (product.badges || []).map(badge => ({
    text: badge,
    variant: getBadgeVariant(badge),
    priority: badge.toLowerCase() === 'oferta' ? 1 : 5 // Ofertas têm prioridade alta
  }));
  
  // Combina e remove duplicatas
  const allBadges = [...autoBadges, ...manualBadges];
  const uniqueBadges = allBadges.filter((badge, index, self) => 
    index === self.findIndex(b => b.text.toLowerCase() === badge.text.toLowerCase())
  );
  
  // Ordena por prioridade e retorna apenas o texto
  return uniqueBadges
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxBadges)
    .map(badge => badge.text);
};

export const getAllBadges = (product: Product): string[] => {
  return getDisplayBadges(product, 999); // Sem limite para página de detalhes
};