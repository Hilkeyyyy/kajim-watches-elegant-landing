import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProductForm } from '@/components/admin/ProductForm';
import { parsePrice } from '@/utils/priceUtils';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';
import { useAdminDataStore } from '@/store/useAdminDataStore';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}


const ProductCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleError, handleSuccess } = useErrorHandler();
  const { fetchProducts } = useAdminDataStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (data: ProductFormData & { images: ImageItem[]; badges: string[] }) => {
    // Debounce 300ms
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    return new Promise<void>((resolve, reject) => {
      debounceRef.current = setTimeout(async () => {
        // Cancelar operação anterior se existir
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        
        try {
          setIsLoading(true);
      
      const productData = {
        // Dados essenciais sempre presentes
        name: data.name,
        brand: data.brand,
        price: parsePrice(data.price),
        description: data.description || '',
        model: data.model || null,
        movement: data.movement || null,
        caliber: data.caliber || null,
        watch_type: data.watch_type || null,
        collection: data.collection || null,
        reference_number: data.reference_number || null,
        production_year: data.production_year || null,
        jewels_count: data.jewels_count || null,
        frequency_hz: data.frequency_hz || null,
        power_reserve: data.power_reserve || null,
        amplitude_degrees: data.amplitude_degrees || null,
        beat_error_ms: data.beat_error_ms || null,
        case_diameter: data.case_diameter || null,
        case_height: data.case_height || null,
        case_thickness: data.case_thickness || null,
        lug_to_lug: data.lug_to_lug || null,
        lug_width_mm: data.lug_width_mm || null,
        weight: data.weight || null,
        crown_diameter: data.crown_diameter || null,
        crystal_diameter: data.crystal_diameter || null,
        bracelet_width: data.bracelet_width || null,
        bracelet_length: data.bracelet_length || null,
        case_material: data.case_material || null,
        bezel_material: data.bezel_material || null,
        crystal: data.crystal || null,
        glass_type: data.glass_type || null,
        dial_material: data.dial_material || null,
        hands_material: data.hands_material || null,
        crown_material: data.crown_material || null,
        caseback_material: data.caseback_material || null,
        strap_material: data.strap_material || null,
        bracelet_material: data.bracelet_material || null,
        clasp_material: data.clasp_material || null,
        indices_material: data.indices_material || null,
        dial_color: data.dial_color || null,
        dial_colors: data.dial_colors || [],
        case_color: data.case_color || null,
        bezel_color: data.bezel_color || null,
        hands_color: data.hands_color || null,
        markers_color: data.markers_color || null,
        strap_color: data.strap_color || null,
        dial_pattern: data.dial_pattern || null,
        dial_finish: data.dial_finish || null,
        water_resistance_meters: data.water_resistance_meters || null,
        water_resistance_atm: data.water_resistance_atm || null,
        anti_magnetic_resistance: data.anti_magnetic_resistance || null,
        shock_resistant: data.shock_resistant || false,
        temperature_resistance: data.temperature_resistance || null,
        indices_type: data.indices_type || null,
        numerals_type: data.numerals_type || null,
        hands_type: data.hands_type || null,
        lume_type: data.lume_type || null,
        crown_type: data.crown_type || null,
        case_back: data.case_back || null,
        bezel_type: data.bezel_type || null,
        clasp_type: data.clasp_type || null,
        buckle_type: data.buckle_type || null,
        certification: data.certification || null,
        warranty: data.warranty || null,
        country_origin: data.country_origin || null,
        limited_edition: data.limited_edition || null,
        msrp: data.msrp || null,
        availability_status: data.availability_status || null,
        replacement_model: data.replacement_model || null,
        box_type: data.box_type || null,
        documentation: data.documentation || null,
        features: data.features || [],
        badges: data.badges || [],
        original_price: data.original_price ? parsePrice(data.original_price) : null,
        stock_quantity: data.stock_quantity || 0,
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        status: (data.status as 'active' | 'inactive' | 'out_of_stock') || 'active',
        images: data.images?.map(img => img.url) || [],
        image_url: data.images?.find(img => img.isMain)?.url || data.images?.[0]?.url || null,
      };

          console.log('ProductCreate - Dados a serem criados:', productData);
          
          const { error } = await supabase
            .from('products')
            .insert(productData);

          if (error) throw error;

          // Atualizar cache
          await fetchProducts({ force: true, signal: abortControllerRef.current?.signal });

          handleSuccess("Produto criado com sucesso!");

          navigate('/admin/produtos');
          resolve();
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Operação cancelada');
            resolve();
            return;
          }
          console.error('Erro ao criar produto:', error);
          handleError(error, 'ProductCreate - Criar Produto');
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    });
  };

  const handleCancel = () => {
    navigate('/admin/produtos');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link to="/admin/produtos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Produto
          </h1>
          <p className="text-sm text-muted-foreground">
            Adicione um novo produto ao catálogo
          </p>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductCreate;