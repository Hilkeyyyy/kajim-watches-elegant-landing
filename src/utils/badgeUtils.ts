import { Product } from "@/types/product";
import { BadgeType, BadgeInfo, BADGE_CONFIG } from "@/types/badge";

export const getBadgeVariant = (badge: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
  // Verifica se é um badge pré-configurado
  const badgeConfig = Object.values(BADGE_CONFIG).find(config => 
    config.text.toLowerCase() === badge.toLowerCase()
  );
  
  if (badgeConfig) {
    return badgeConfig.variant;
  }

  // Fallback para badges legados
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
  
  // Badge de limitado automático (estoque baixo mas não zerado)
  if (product.stock_quantity && product.stock_quantity > 0 && product.stock_quantity <= 5) {
    // Só adiciona se não tiver o badge manual de Limitado
    const hasLimitedBadge = product.badges?.includes(BadgeType.LIMITADO);
    if (!hasLimitedBadge) {
      badges.push({
        text: 'Limitado',
        variant: 'secondary',
        priority: 4
      });
    }
  }
  
  return badges;
};

export const getDisplayBadges = (product: Product, maxBadges: number = 2): string[] => {
  // Primeiro, pega badges automáticas
  const autoBadges = generateAutoBadges(product);
  
  // Depois, adiciona badges manuais do produto
  const manualBadges: BadgeInfo[] = (product.badges || []).map(badge => {
    const badgeConfig = Object.values(BADGE_CONFIG).find(config => 
      config.text === badge
    );
    
    return {
      text: badge,
      variant: badgeConfig?.variant || getBadgeVariant(badge),
      priority: badgeConfig?.priority || 5
    };
  });
  
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

export const hasSpecificBadge = (product: Product, badgeType: BadgeType): boolean => {
  return product.badges?.includes(badgeType) || false;
};

export const getCarouselType = (badgeType: BadgeType): string | undefined => {
  return BADGE_CONFIG[badgeType]?.carouselType;
};

export const getAllBadges = (product: Product): string[] => {
  return getDisplayBadges(product, 999); // Sem limite para página de detalhes
};