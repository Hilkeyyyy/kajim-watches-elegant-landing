import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProductForm } from '@/components/admin/ProductForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parsePrice } from '@/utils/priceUtils';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}


const ProductEdit = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleError, handleSuccess } = useErrorHandler();

  console.log('ProductEdit - Renderizando com:', { id, product: !!product, isFetching, isLoading, error });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        console.warn('ProductEdit - ID não fornecido');
        setError('ID do produto é obrigatório');
        setIsFetching(false);
        return;
      }
      
      try {
        console.log('ProductEdit - Buscando produto:', id);
        setIsFetching(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('ProductEdit - Erro na query:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('Produto não encontrado');
        }

        console.log('ProductEdit - Produto carregado:', data.name);
        setProduct(data);
      } catch (error) {
        console.error('ProductEdit - Erro ao buscar produto:', error);
        const appError = handleError(error, 'ProductEdit - Buscar Produto');
        setError(appError.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate, handleError]);

  const handleSubmit = async (data: ProductFormData & { images: ImageItem[]; badges: string[] }) => {
    if (!id) {
      console.error('ProductEdit - ID não disponível para submit');
      return;
    }
    
    try {
      console.log('ProductEdit - Iniciando submit para produto:', id);
      setIsLoading(true);
      
      // Validações antes do envio
      if (!data.name || !data.price || !data.brand) {
        throw new Error('Campos obrigatórios não preenchidos');
      }

      const price = parsePrice(data.price);
      const originalPrice = data.original_price ? parsePrice(data.original_price) : null;
      if (isNaN(price) || price <= 0) {
        throw new Error('Preço deve ser um número válido maior que zero');
      }
      
      const productData = {
        // Básico
        name: data.name,
        brand: data.brand,
        model: data.model,
        description: data.description,
        // Preços
        price,
        original_price: originalPrice,
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
        status: data.status || 'active',
        // Imagens
        images: data.images.map(img => img.url),
        image_url: data.images.find(img => img.isMain)?.url || data.images[0]?.url,
        // Metadados
        updated_at: new Date().toISOString(),
      } as const;

      console.log('ProductEdit - Enviando dados para Supabase:', {
        id,
        name: productData.name,
        imagesCount: productData.images.length
      });

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) {
        console.error('ProductEdit - Erro na query:', error);
        throw error;
      }

      console.log('ProductEdit - Produto atualizado com sucesso');
      handleSuccess(`Produto "${data.name}" atualizado com sucesso!`);

      navigate('/admin/produtos', { replace: true });
    } catch (error) {
      console.error('ProductEdit - Erro ao atualizar produto:', error);
      handleError(error, 'ProductEdit - Atualizar Produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/produtos');
  };

  if (isFetching) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/produtos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Produtos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return null;
  }

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
            <Edit className="h-5 w-5" />
            Editar Produto
          </h1>
          <p className="text-sm text-muted-foreground">
            Edite as informações do produto "{product.name}"
          </p>
        </div>
      </div>

      {product ? (
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductEdit;