
export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  images: string[];
  description: string;
  brand: string;
  model?: string;
  
  // Especificações básicas
  movement?: string;
  caliber?: string;
  watch_type?: string;
  collection?: string;
  reference_number?: string;
  production_year?: string;
  jewels_count?: string;
  frequency_hz?: string;
  power_reserve?: string;
  amplitude_degrees?: string;
  beat_error_ms?: string;
  
  // Dimensões
  case_diameter?: string;
  case_height?: string;
  case_thickness?: string;
  case_size?: string;
  lug_to_lug?: string;
  lug_width_mm?: string;
  lug_width?: string;
  weight?: string;
  thickness?: string;
  crown_diameter?: string;
  crystal_diameter?: string;
  bracelet_width?: string;
  bracelet_length?: string;
  
  // Materiais
  material?: string;
  case_material?: string;
  bezel_material?: string;
  crystal?: string;
  glass_type?: string;
  dial_material?: string;
  hands_material?: string;
  crown_material?: string;
  caseback_material?: string;
  strap_material?: string;
  bracelet_material?: string;
  clasp_material?: string;
  indices_material?: string;
  
  // Cores e acabamentos
  dial_color?: string;
  dial_colors?: string[];
  case_color?: string;
  bezel_color?: string;
  hands_color?: string;
  markers_color?: string;
  strap_color?: string;
  dial_pattern?: string;
  dial_finish?: string;
  
  // Especificações avançadas
  water_resistance?: string;
  water_resistance_meters?: string;
  water_resistance_atm?: string;
  anti_magnetic_resistance?: string;
  shock_resistant?: boolean;
  temperature_resistance?: string;
  indices_type?: string;
  numerals_type?: string;
  hands_type?: string;
  lume_type?: string;
  crown_type?: string;
  case_back?: string;
  bezel_type?: string;
  clasp_type?: string;
  buckle_type?: string;
  certification?: string;
  warranty?: string;
  country_origin?: string;
  limited_edition?: string;
  
  // Comerciais
  msrp?: string;
  availability_status?: string;
  replacement_model?: string;
  box_type?: string;
  documentation?: string;
  
  // Legacy fields
  complications?: string[];
  
  // Status e metadados
  features: string[];
  badges?: string[];
  custom_tags?: string[];
  stock_quantity?: number;
  stock_status?: string;
  status?: string;
  is_visible?: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const convertSupabaseToProduct = (supabaseProduct: SupabaseProduct) => {
  return {
    ...supabaseProduct,
    image: supabaseProduct.image_url || '',
    price: supabaseProduct.price.toString(),
    status: (supabaseProduct.status || 'active') as 'active' | 'inactive' | 'out_of_stock',
    created_at: supabaseProduct.created_at || new Date().toISOString(),
    updated_at: supabaseProduct.updated_at || new Date().toISOString(),
  };
};
