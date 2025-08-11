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

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

interface ProductFormData {
  name: string;
  price: string;
  brand: string;
  model?: string;
  description?: string;
  stock_quantity?: number;
  is_visible?: boolean;
  is_featured?: boolean;
  status?: 'active' | 'inactive' | 'out_of_stock';
  movement?: string;
  case_size?: string;
  material?: string;
  water_resistance?: string;
  warranty?: string;
  watch_type?: string;
  glass_type?: string;
  dial_color?: string;
  strap_material?: string;
  images: ImageItem[];
  badges: string[];
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

  const handleSubmit = async (data: ProductFormData) => {
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
      if (isNaN(price) || price <= 0) {
        throw new Error('Preço deve ser um número válido maior que zero');
      }
      
      const productData = {
        name: data.name,
        price,
        brand: data.brand,
        model: data.model,
        description: data.description,
        stock_quantity: data.stock_quantity || 0,
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        status: data.status || 'active',
        movement: data.movement,
        case_size: data.case_size,
        material: data.material,
        water_resistance: data.water_resistance,
        warranty: data.warranty,
        watch_type: data.watch_type,
        glass_type: data.glass_type,
        dial_color: data.dial_color,
        strap_material: data.strap_material,
        images: data.images.map(img => img.url),
        image_url: data.images.find(img => img.isMain)?.url || data.images[0]?.url,
        badges: data.badges,
        updated_at: new Date().toISOString(),
      };

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