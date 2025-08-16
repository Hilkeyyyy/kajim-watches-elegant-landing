import { parsePrice } from './priceUtils';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

/**
 * Constrói um payload seguro para criação/atualização de produtos no Supabase
 * Remove valores undefined/null desnecessários e garante tipos corretos
 */
export const buildSafeProductPayload = (
  data: ProductFormData & { images: ImageItem[]; badges: string[] }
) => {
  const safePayload = {
    // Dados essenciais sempre presentes - obrigatórios
    name: String(data.name || '').trim(),
    brand: String(data.brand || '').trim(),
    price: parsePrice(String(data.price || '0')),
    description: String(data.description || '').trim(),
    
    // Campos opcionais - apenas incluir se houver valor real
    ...(data.model?.trim() && { model: data.model.trim() }),
    ...(data.movement?.trim() && { movement: data.movement.trim() }),
    ...(data.caliber?.trim() && { caliber: data.caliber.trim() }),
    ...(data.watch_type?.trim() && { watch_type: data.watch_type.trim() }),
    ...(data.collection?.trim() && { collection: data.collection.trim() }),
    ...(data.reference_number?.trim() && { reference_number: data.reference_number.trim() }),
    ...(data.production_year?.trim() && { production_year: data.production_year.trim() }),
    ...(data.jewels_count?.trim() && { jewels_count: data.jewels_count.trim() }),
    ...(data.frequency_hz?.trim() && { frequency_hz: data.frequency_hz.trim() }),
    ...(data.power_reserve?.trim() && { power_reserve: data.power_reserve.trim() }),
    ...(data.amplitude_degrees?.trim() && { amplitude_degrees: data.amplitude_degrees.trim() }),
    ...(data.beat_error_ms?.trim() && { beat_error_ms: data.beat_error_ms.trim() }),
    
    // Dimensões - apenas se preenchidas
    ...(data.case_diameter?.trim() && { case_diameter: data.case_diameter.trim() }),
    ...(data.case_height?.trim() && { case_height: data.case_height.trim() }),
    ...(data.case_thickness?.trim() && { case_thickness: data.case_thickness.trim() }),
    ...(data.lug_to_lug?.trim() && { lug_to_lug: data.lug_to_lug.trim() }),
    ...(data.lug_width_mm?.trim() && { lug_width_mm: data.lug_width_mm.trim() }),
    ...(data.weight?.trim() && { weight: data.weight.trim() }),
    ...(data.crown_diameter?.trim() && { crown_diameter: data.crown_diameter.trim() }),
    ...(data.crystal_diameter?.trim() && { crystal_diameter: data.crystal_diameter.trim() }),
    ...(data.bracelet_width?.trim() && { bracelet_width: data.bracelet_width.trim() }),
    ...(data.bracelet_length?.trim() && { bracelet_length: data.bracelet_length.trim() }),
    
    // Materiais
    ...(data.case_material?.trim() && { case_material: data.case_material.trim() }),
    ...(data.bezel_material?.trim() && { bezel_material: data.bezel_material.trim() }),
    ...(data.crystal?.trim() && { crystal: data.crystal.trim() }),
    ...(data.glass_type?.trim() && { glass_type: data.glass_type.trim() }),
    ...(data.dial_material?.trim() && { dial_material: data.dial_material.trim() }),
    ...(data.hands_material?.trim() && { hands_material: data.hands_material.trim() }),
    ...(data.crown_material?.trim() && { crown_material: data.crown_material.trim() }),
    ...(data.caseback_material?.trim() && { caseback_material: data.caseback_material.trim() }),
    ...(data.strap_material?.trim() && { strap_material: data.strap_material.trim() }),
    ...(data.bracelet_material?.trim() && { bracelet_material: data.bracelet_material.trim() }),
    ...(data.clasp_material?.trim() && { clasp_material: data.clasp_material.trim() }),
    ...(data.indices_material?.trim() && { indices_material: data.indices_material.trim() }),
    
    // Cores
    ...(data.dial_color?.trim() && { dial_color: data.dial_color.trim() }),
    ...(data.case_color?.trim() && { case_color: data.case_color.trim() }),
    ...(data.bezel_color?.trim() && { bezel_color: data.bezel_color.trim() }),
    ...(data.hands_color?.trim() && { hands_color: data.hands_color.trim() }),
    ...(data.markers_color?.trim() && { markers_color: data.markers_color.trim() }),
    ...(data.strap_color?.trim() && { strap_color: data.strap_color.trim() }),
    
    // Arrays - sempre incluir mesmo se vazios
    dial_colors: Array.isArray(data.dial_colors) ? data.dial_colors.filter(Boolean) : [],
    features: Array.isArray(data.features) ? data.features.filter(Boolean) : [],
    badges: Array.isArray(data.badges) ? data.badges.filter(Boolean) : [],
    
    // Campos específicos de produto
    ...(data.dial_pattern?.trim() && { dial_pattern: data.dial_pattern.trim() }),
    ...(data.dial_finish?.trim() && { dial_finish: data.dial_finish.trim() }),
    ...(data.water_resistance_meters?.trim() && { water_resistance_meters: data.water_resistance_meters.trim() }),
    ...(data.water_resistance_atm?.trim() && { water_resistance_atm: data.water_resistance_atm.trim() }),
    ...(data.anti_magnetic_resistance?.trim() && { anti_magnetic_resistance: data.anti_magnetic_resistance.trim() }),
    ...(data.temperature_resistance?.trim() && { temperature_resistance: data.temperature_resistance.trim() }),
    ...(data.indices_type?.trim() && { indices_type: data.indices_type.trim() }),
    ...(data.numerals_type?.trim() && { numerals_type: data.numerals_type.trim() }),
    ...(data.hands_type?.trim() && { hands_type: data.hands_type.trim() }),
    ...(data.lume_type?.trim() && { lume_type: data.lume_type.trim() }),
    ...(data.crown_type?.trim() && { crown_type: data.crown_type.trim() }),
    ...(data.case_back?.trim() && { case_back: data.case_back.trim() }),
    ...(data.bezel_type?.trim() && { bezel_type: data.bezel_type.trim() }),
    ...(data.clasp_type?.trim() && { clasp_type: data.clasp_type.trim() }),
    ...(data.buckle_type?.trim() && { buckle_type: data.buckle_type.trim() }),
    ...(data.certification?.trim() && { certification: data.certification.trim() }),
    ...(data.warranty?.trim() && { warranty: data.warranty.trim() }),
    ...(data.country_origin?.trim() && { country_origin: data.country_origin.trim() }),
    ...(data.limited_edition?.trim() && { limited_edition: data.limited_edition.trim() }),
    ...(data.msrp?.trim() && { msrp: data.msrp.trim() }),
    ...(data.availability_status?.trim() && { availability_status: data.availability_status.trim() }),
    ...(data.replacement_model?.trim() && { replacement_model: data.replacement_model.trim() }),
    ...(data.box_type?.trim() && { box_type: data.box_type.trim() }),
    ...(data.documentation?.trim() && { documentation: data.documentation.trim() }),
    
    // Preço original
    ...(data.original_price && { original_price: parsePrice(String(data.original_price)) }),
    
    // Campos numéricos
    stock_quantity: Number(data.stock_quantity || 0),
    
    // Campos booleanos
    is_visible: Boolean(data.is_visible ?? true),
    is_featured: Boolean(data.is_featured ?? false),
    shock_resistant: Boolean(data.shock_resistant ?? false),
    
    // Status
    status: (data.status as 'active' | 'inactive' | 'out_of_stock') || 'active',
    
    // Imagens
    images: Array.isArray(data.images) ? data.images.map(img => img.url).filter(Boolean) : [],
    image_url: data.images?.find(img => img.isMain)?.url || data.images?.[0]?.url || null,
  };

  // Remover campos undefined para não causar problemas no Supabase
  const cleanPayload = Object.fromEntries(
    Object.entries(safePayload).filter(([_, value]) => value !== undefined)
  );
  
  return cleanPayload as any;
};

/**
 * Valida se os dados essenciais estão presentes
 */
export const validateProductData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('Nome do produto é obrigatório');
  }
  
  if (!data.brand?.trim()) {
    errors.push('Marca é obrigatória');
  }
  
  if (!data.price || isNaN(Number(data.price)) || Number(data.price) <= 0) {
    errors.push('Preço deve ser um valor válido maior que zero');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};