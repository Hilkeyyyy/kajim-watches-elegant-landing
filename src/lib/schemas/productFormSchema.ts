import { z } from 'zod';

export const productFormSchema = z.object({
  // Campos obrigatórios
  name: z.string().min(1, 'Nome é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  price: z.string().min(1, 'Preço é obrigatório'),
  
  // Campos opcionais básicos
  model: z.string().optional(),
  description: z.string().optional(),
  original_price: z.string().optional(),
  
  // Imagens
  image_url: z.string().optional(),
  images: z.array(z.string()).optional(),
  
  // Status e visibilidade
  is_visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  status: z.enum(['active', 'discontinued', 'coming_soon']).default('active'),
  
  // Estoque
  stock_quantity: z.number().min(0).default(0),
  stock_status: z.string().optional(),
  
  // Tags e badges
  badges: z.array(z.string()).optional(),
  custom_tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  
  // Especificações técnicas básicas
  case_size: z.string().optional(),
  movement: z.string().optional(),
  material: z.string().optional(),
  water_resistance: z.string().optional(),
  warranty: z.string().optional(),
  
  // Especificações avançadas
  watch_type: z.string().optional(),
  bezel_type: z.string().optional(),
  glass_type: z.string().optional(),
  clasp_type: z.string().optional(),
  certification: z.string().optional(),
  power_reserve: z.string().optional(),
  complications: z.array(z.string()).optional(),
  
  // Cores e materiais
  dial_color: z.string().optional(),
  dial_colors: z.array(z.string()).optional(),
  case_color: z.string().optional(),
  bezel_color: z.string().optional(),
  hands_color: z.string().optional(),
  markers_color: z.string().optional(),
  strap_color: z.string().optional(),
  
  case_material: z.string().optional(),
  bezel_material: z.string().optional(),
  dial_material: z.string().optional(),
  hands_material: z.string().optional(),
  crown_material: z.string().optional(),
  caseback_material: z.string().optional(),
  strap_material: z.string().optional(),
  bracelet_material: z.string().optional(),
  
  // Dimensões
  case_diameter: z.string().optional(),
  case_height: z.string().optional(),
  case_thickness: z.string().optional(),
  thickness: z.string().optional(),
  lug_to_lug: z.string().optional(),
  lug_width: z.string().optional(),
  lug_width_mm: z.string().optional(),
  weight: z.string().optional(),
  crown_diameter: z.string().optional(),
  crystal_diameter: z.string().optional(),
  
  // Resistências
  water_resistance_meters: z.string().optional(),
  water_resistance_atm: z.string().optional(),
  anti_magnetic_resistance: z.string().optional(),
  temperature_resistance: z.string().optional(),
  shock_resistance: z.string().optional(),
  
  // Movimento
  caliber: z.string().optional(),
  jewels: z.string().optional(),
  jewels_count: z.string().optional(),
  frequency: z.string().optional(),
  frequency_hz: z.string().optional(),
  amplitude: z.string().optional(),
  amplitude_degrees: z.string().optional(),
  beat_error: z.string().optional(),
  beat_error_ms: z.string().optional(),
  
  // Mostrador
  dial_pattern: z.string().optional(),
  dial_finish: z.string().optional(),
  indices_type: z.string().optional(),
  indices_material: z.string().optional(),
  numerals_type: z.string().optional(),
  logo_position: z.string().optional(),
  
  // Ponteiros e marcadores
  hands_type: z.string().optional(),
  markers_type: z.string().optional(),
  date_display: z.string().optional(),
  
  // Pulseira/bracelete
  bracelet_type: z.string().optional(),
  bracelet_width: z.string().optional(),
  bracelet_length: z.string().optional(),
  buckle_type: z.string().optional(),
  clasp_material: z.string().optional(),
  clasp_width: z.string().optional(),
  
  // Caixa
  case_back: z.string().optional(),
  crown_type: z.string().optional(),
  pushers: z.string().optional(),
  crystal: z.string().optional(),
  
  // Luminosidade
  lume_type: z.string().optional(),
  luminosity: z.string().optional(),
  
  // Recursos especiais
  special_features: z.array(z.string()).optional(),
  limited_edition: z.string().optional(),
  production_year: z.string().optional(),
  collection: z.string().optional(),
  reference_number: z.string().optional(),
  country_origin: z.string().optional(),
  
  // Resistências especiais
  anti_magnetic: z.string().optional(),
  operating_temperature: z.string().optional(),
  altitude_resistance: z.string().optional(),
  pressure_resistance: z.string().optional(),
  vibration_resistance: z.string().optional(),
  shock_resistant: z.boolean().optional(),
  
  // Complicações
  calendar_type: z.string().optional(),
  timezone_display: z.string().optional(),
  chronograph_type: z.string().optional(),
  subdials: z.string().optional(),
  
  // Embalagem e acessórios
  box_type: z.string().optional(),
  documentation: z.string().optional(),
  included_accessories: z.array(z.string()).optional(),
  
  // Informações comerciais
  msrp: z.string().optional(),
  availability_status: z.string().optional(),
  replacement_model: z.string().optional(),
  discontinued_date: z.string().optional(),
  
  // Ordem e exibição
  sort_order: z.number().optional(),
  
  // Especificações JSON
  specs: z.record(z.string(), z.any()).optional(),
});