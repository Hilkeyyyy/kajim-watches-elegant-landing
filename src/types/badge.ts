export enum BadgeType {
  DESTAQUE = 'Destaque',
  NOVIDADE = 'Novidade', 
  OFERTA = 'Oferta',
  LIMITADO = 'Limitado'
}

export interface BadgeInfo {
  text: string;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
  priority: number;
  carouselType?: 'featured' | 'new' | 'offers' | 'limited';
}

export const BADGE_CONFIG: Record<BadgeType, BadgeInfo> = {
  [BadgeType.DESTAQUE]: {
    text: 'Destaque',
    variant: 'outline',
    priority: 2,
    carouselType: 'featured'
  },
  [BadgeType.NOVIDADE]: {
    text: 'Novidade',
    variant: 'default', 
    priority: 3,
    carouselType: 'new'
  },
  [BadgeType.OFERTA]: {
    text: 'Oferta',
    variant: 'destructive',
    priority: 1,
    carouselType: 'offers'
  },
  [BadgeType.LIMITADO]: {
    text: 'Limitado',
    variant: 'secondary',
    priority: 4,
    carouselType: 'limited'
  }
};

export const AVAILABLE_BADGES = Object.values(BadgeType);