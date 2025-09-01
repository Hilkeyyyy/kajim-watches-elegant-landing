import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProductForm } from '@/components/admin/ProductForm';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { buildSafeProductPayload, validateProductData } from '@/utils/productUtils';
import { logAdminAction } from '@/utils/auditLogger';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

interface ImageItem {
  id: string;
  url: string;
  isMain: boolean;
}

const ProductEdit = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { handleError: handleErrorToast, handleSuccess } = useErrorHandler();
  const { fetchProducts } = useAdminDataStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Buscar produto
  useEffect(() => {
    if (!id) {
      console.error('ProductEdit - ID do produto não encontrado');
      setError('ID do produto não encontrado');
      setIsFetching(false);
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();
    
    const fetchProduct = async () => {
      try {
        console.log('ProductEdit - Carregando produto:', id);
        setIsFetching(true);
        setError(null);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (abortController.signal.aborted) return;

        if (error) {
          console.error('ProductEdit - Erro ao buscar produto:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Produto não encontrado');
        }

        if (isMounted) {
          console.log('ProductEdit - Produto carregado:', data);
          setProduct(data);
        }
      } catch (error) {
        if (isMounted && !abortController.signal.aborted) {
          console.error('ProductEdit - Erro ao carregar produto:', error);
          setError('Erro ao carregar produto');
          handleErrorToast(error, 'ProductEdit - Fetch');
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [id, handleErrorToast]);

  const handleSubmit = async (data: ProductFormData & { images: ImageItem[]; badges: string[] }) => {
    // Debounce para evitar múltiplas submissões
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
          if (!product?.id) {
            throw new Error('ID do produto não encontrado');
          }

          setIsLoading(true);

          // Validar dados essenciais
          const validation = validateProductData(data);
          if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
          }

          // Verificar se há pelo menos uma imagem
          if (!data.images || data.images.length === 0) {
            throw new Error('É necessário ter pelo menos uma imagem do produto');
          }

          // Construir payload seguro com ID para update
          const productPayload = {
            id: product.id,
            ...buildSafeProductPayload(data),
            updated_at: new Date().toISOString(),
          };

          console.log('ProductEdit - Payload seguro:', productPayload);

          const { data: updatedProduct, error } = await supabase
            .from('products')
            .upsert(productPayload, { onConflict: 'id', ignoreDuplicates: false })
            .select()
            .maybeSingle();

          if (error) {
            console.error('ProductEdit - Erro do Supabase:', error);
            throw error;
          }

          // Em casos raros, o PostgREST pode não retornar a linha. Seguimos com o fluxo e fazemos refetch abaixo.

          console.log('ProductEdit - Produto atualizado com sucesso');
          
          // Log admin action for audit trail
          logAdminAction('update_product', product.id, { 
            productName: updatedProduct.name 
          });
          
          // Recarregar cache de produtos
          await fetchProducts({ force: true });
          
          // Navegar diretamente para lista de produtos com mensagem de sucesso
          navigate('/admin/produtos', { 
            replace: true,
            state: { successMessage: `Produto "${data.name}" atualizado com sucesso!` }
          });
          
          resolve();
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('ProductEdit - Operação cancelada');
            resolve();
            return;
          }
          console.error('ProductEdit - Erro:', error);
          handleErrorToast(error, 'ProductEdit');
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

  if (error || !product) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/admin/produtos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Erro</h1>
            <p className="text-sm text-muted-foreground">
              {error || 'Produto não encontrado'}
            </p>
          </div>
        </div>
      </div>
    );
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
            Atualize as informações do produto
          </p>
        </div>
      </div>

      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductEdit;