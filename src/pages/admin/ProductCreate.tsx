import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from '@/components/admin/ProductForm';
import { parsePrice } from '@/utils/priceUtils';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';

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
  const { toast } = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      
      const productData = {
        // Básico
        name: data.name,
        brand: data.brand,
        model: data.model,
        description: data.description,
        // Preços
        price: parsePrice(data.price),
        original_price: data.original_price ? parsePrice(data.original_price) : null,
        // Especificações básicas
        movement: data.movement,
        caliber: data.caliber,
        watch_type: data.watch_type,
        collection: data.collection,
        reference_number: data.reference_number,
        production_year: data.production_year,
        jewels_count: data.jewels_count,
        frequency_hz: data.frequency_hz,
        power_reserve: data.power_reserve,
        amplitude_degrees: data.amplitude_degrees,
        beat_error_ms: data.beat_error_ms,
        // Dimensões
        case_diameter: data.case_diameter,
        case_height: data.case_height,
        case_thickness: data.case_thickness,
        lug_to_lug: data.lug_to_lug,
        lug_width_mm: data.lug_width_mm,
        weight: data.weight,
        crown_diameter: data.crown_diameter,
        crystal_diameter: data.crystal_diameter,
        bracelet_width: data.bracelet_width,
        bracelet_length: data.bracelet_length,
        // Materiais
        case_material: data.case_material,
        bezel_material: data.bezel_material,
        crystal: data.crystal,
        glass_type: data.glass_type,
        dial_material: data.dial_material,
        hands_material: data.hands_material,
        crown_material: data.crown_material,
        caseback_material: data.caseback_material,
        strap_material: data.strap_material,
        bracelet_material: data.bracelet_material,
        clasp_material: data.clasp_material,
        indices_material: data.indices_material,
        // Cores
        dial_color: data.dial_color,
        dial_colors: data.dial_colors,
        case_color: data.case_color,
        bezel_color: data.bezel_color,
        hands_color: data.hands_color,
        markers_color: data.markers_color,
        strap_color: data.strap_color,
        dial_pattern: data.dial_pattern,
        dial_finish: data.dial_finish,
        // Avançadas
        water_resistance_meters: data.water_resistance_meters,
        water_resistance_atm: data.water_resistance_atm,
        anti_magnetic_resistance: data.anti_magnetic_resistance,
        shock_resistant: data.shock_resistant,
        temperature_resistance: data.temperature_resistance,
        indices_type: data.indices_type,
        numerals_type: data.numerals_type,
        hands_type: data.hands_type,
        lume_type: data.lume_type,
        crown_type: data.crown_type,
        case_back: data.case_back,
        bezel_type: data.bezel_type,
        clasp_type: data.clasp_type,
        buckle_type: data.buckle_type,
        certification: data.certification,
        warranty: data.warranty,
        country_origin: data.country_origin,
        limited_edition: data.limited_edition,
        // Comerciais
        msrp: data.msrp,
        availability_status: data.availability_status,
        replacement_model: data.replacement_model,
        box_type: data.box_type,
        documentation: data.documentation,
        // Listas
        features: data.features,
        badges: data.badges,
        // Status/flags
        stock_quantity: data.stock_quantity || 0,
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        status: (data.status as 'active' | 'inactive' | 'out_of_stock') || 'active',
        // Imagens
        images: data.images.map(img => img.url),
        image_url: data.images.find(img => img.isMain)?.url || data.images[0]?.url,
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!"
      });

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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