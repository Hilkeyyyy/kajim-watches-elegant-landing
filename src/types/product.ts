export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  brand: string;
  model?: string;
  movement?: string;
  case_size?: string;
  material?: string;
  water_resistance?: string;
  warranty?: string;
  watch_type?: string;
  bezel_type?: string;
  glass_type?: string;
  clasp_type?: string;
  certification?: string;
  power_reserve?: string;
  complications?: string[];
  dial_color?: string;
  strap_material?: string;
  weight?: string;
  thickness?: string;
  lug_width?: string;
  country_origin?: string;
  features: string[];
  badges?: string[];
  custom_tags?: string[];
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  is_visible?: boolean;
  is_featured?: boolean;
}

export interface ProductCardProps {
  product: Omit<Product, 'images' | 'features'>;
  onProductClick: (id: string) => void;
}