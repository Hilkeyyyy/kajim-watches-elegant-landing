// Interface que representa o produto como retornado pelo Supabase
export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
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
  image_url?: string;
  images?: string[];
  description?: string;
  features?: string[];
  badges?: string[];
  custom_tags?: string[];
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  is_visible?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

// Função para converter SupabaseProduct para Product (usado na interface)
export const convertSupabaseToProduct = (supabaseProduct: SupabaseProduct) => {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    price: `R$ ${supabaseProduct.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    image: supabaseProduct.image_url || '',
    images: supabaseProduct.images || [supabaseProduct.image_url || ''],
    description: supabaseProduct.description || '',
    brand: supabaseProduct.brand,
    model: supabaseProduct.model,
    movement: supabaseProduct.movement,
    case_size: supabaseProduct.case_size,
    material: supabaseProduct.material,
    water_resistance: supabaseProduct.water_resistance,
    warranty: supabaseProduct.warranty,
    watch_type: supabaseProduct.watch_type,
    bezel_type: supabaseProduct.bezel_type,
    glass_type: supabaseProduct.glass_type,
    clasp_type: supabaseProduct.clasp_type,
    certification: supabaseProduct.certification,
    power_reserve: supabaseProduct.power_reserve,
    complications: supabaseProduct.complications,
    dial_color: supabaseProduct.dial_color,
    strap_material: supabaseProduct.strap_material,
    weight: supabaseProduct.weight,
    thickness: supabaseProduct.thickness,
    lug_width: supabaseProduct.lug_width,
    country_origin: supabaseProduct.country_origin,
    features: supabaseProduct.features || [],
    badges: supabaseProduct.badges,
    custom_tags: supabaseProduct.custom_tags,
    stock_quantity: supabaseProduct.stock_quantity,
    stock_status: supabaseProduct.stock_status,
    status: supabaseProduct.status,
    is_visible: supabaseProduct.is_visible,
    is_featured: supabaseProduct.is_featured
  };
};