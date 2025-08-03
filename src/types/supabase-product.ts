// Interface que representa o produto como retornado pelo Supabase
export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
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
  case_size?: string; // Legacy
  lug_to_lug?: string;
  lug_width_mm?: string;
  lug_width?: string; // Legacy
  weight?: string;
  thickness?: string; // Legacy
  crown_diameter?: string;
  crystal_diameter?: string;
  bracelet_width?: string;
  bracelet_length?: string;
  
  // Materiais
  material?: string; // Legacy
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
  water_resistance?: string; // Legacy
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
  
  // Legacy
  complications?: string[];
  
  // Metadados
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
    
    // Especificações básicas
    movement: supabaseProduct.movement,
    caliber: supabaseProduct.caliber,
    watch_type: supabaseProduct.watch_type,
    collection: supabaseProduct.collection,
    reference_number: supabaseProduct.reference_number,
    production_year: supabaseProduct.production_year,
    jewels_count: supabaseProduct.jewels_count,
    frequency_hz: supabaseProduct.frequency_hz,
    power_reserve: supabaseProduct.power_reserve,
    amplitude_degrees: supabaseProduct.amplitude_degrees,
    beat_error_ms: supabaseProduct.beat_error_ms,
    
    // Dimensões
    case_diameter: supabaseProduct.case_diameter,
    case_height: supabaseProduct.case_height,
    case_thickness: supabaseProduct.case_thickness,
    case_size: supabaseProduct.case_size, // Legacy
    lug_to_lug: supabaseProduct.lug_to_lug,
    lug_width_mm: supabaseProduct.lug_width_mm,
    lug_width: supabaseProduct.lug_width, // Legacy
    weight: supabaseProduct.weight,
    thickness: supabaseProduct.thickness, // Legacy
    crown_diameter: supabaseProduct.crown_diameter,
    crystal_diameter: supabaseProduct.crystal_diameter,
    bracelet_width: supabaseProduct.bracelet_width,
    bracelet_length: supabaseProduct.bracelet_length,
    
    // Materiais
    material: supabaseProduct.material, // Legacy
    case_material: supabaseProduct.case_material,
    bezel_material: supabaseProduct.bezel_material,
    crystal: supabaseProduct.crystal,
    glass_type: supabaseProduct.glass_type,
    dial_material: supabaseProduct.dial_material,
    hands_material: supabaseProduct.hands_material,
    crown_material: supabaseProduct.crown_material,
    caseback_material: supabaseProduct.caseback_material,
    strap_material: supabaseProduct.strap_material,
    bracelet_material: supabaseProduct.bracelet_material,
    clasp_material: supabaseProduct.clasp_material,
    indices_material: supabaseProduct.indices_material,
    
    // Cores e acabamentos
    dial_color: supabaseProduct.dial_color,
    dial_colors: supabaseProduct.dial_colors,
    case_color: supabaseProduct.case_color,
    bezel_color: supabaseProduct.bezel_color,
    hands_color: supabaseProduct.hands_color,
    markers_color: supabaseProduct.markers_color,
    strap_color: supabaseProduct.strap_color,
    dial_pattern: supabaseProduct.dial_pattern,
    dial_finish: supabaseProduct.dial_finish,
    
    // Especificações avançadas
    water_resistance: supabaseProduct.water_resistance, // Legacy
    water_resistance_meters: supabaseProduct.water_resistance_meters,
    water_resistance_atm: supabaseProduct.water_resistance_atm,
    anti_magnetic_resistance: supabaseProduct.anti_magnetic_resistance,
    shock_resistant: supabaseProduct.shock_resistant,
    temperature_resistance: supabaseProduct.temperature_resistance,
    indices_type: supabaseProduct.indices_type,
    numerals_type: supabaseProduct.numerals_type,
    hands_type: supabaseProduct.hands_type,
    lume_type: supabaseProduct.lume_type,
    crown_type: supabaseProduct.crown_type,
    case_back: supabaseProduct.case_back,
    bezel_type: supabaseProduct.bezel_type,
    clasp_type: supabaseProduct.clasp_type,
    buckle_type: supabaseProduct.buckle_type,
    certification: supabaseProduct.certification,
    warranty: supabaseProduct.warranty,
    country_origin: supabaseProduct.country_origin,
    limited_edition: supabaseProduct.limited_edition,
    
    // Comerciais
    msrp: supabaseProduct.msrp,
    availability_status: supabaseProduct.availability_status,
    replacement_model: supabaseProduct.replacement_model,
    box_type: supabaseProduct.box_type,
    documentation: supabaseProduct.documentation,
    
    // Legacy
    complications: supabaseProduct.complications,
    
    // Metadados
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