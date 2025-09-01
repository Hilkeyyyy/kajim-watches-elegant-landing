
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProductForm } from '@/components/admin/ProductForm';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { buildSafeProductPayload, validateProductData } from '@/utils/productUtils';
import { logAdminAction } from '@/utils/auditLogger';

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

  const handleSubmit = async (data: ProductFormData & { images: ImageItem[]; badges: string[] }) => {
    let didNavigate = false;
    try {
      setIsLoading(true);

      // Cancelar operação anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Validar dados essenciais
      const validation = validateProductData(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Verificar se há pelo menos uma imagem
      if (!data.images || data.images.length === 0) {
        throw new Error('É necessário adicionar pelo menos uma imagem do produto');
      }

      // Construir payload seguro
      const productPayload = buildSafeProductPayload(data);
      
      console.log('ProductCreate - Criando produto:', productPayload);
      
      const { data: createdProduct, error } = await supabase
        .from('products')
        .insert(productPayload)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Erro ao salvar: ${error.message}`);
      }

      let finalProduct = createdProduct;
      if (!finalProduct) {
        // Fallback em casos raros onde o PostgREST não retorna a linha
        const { data: refetched } = await supabase
          .from('products')
          .select('*')
          .eq('name', productPayload.name)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        finalProduct = refetched as any;
      }

      console.log('ProductCreate - Produto criado com sucesso:', finalProduct);
      
      // Log admin action
      const createdId = (finalProduct as any)?.id;
      if (createdId) {
        logAdminAction('create_product', createdId, { 
          productName: (finalProduct as any)?.name 
        });
      }
      
      // Navegar diretamente para lista de produtos com mensagem de sucesso
      setIsLoading(false);
      didNavigate = true;
      navigate('/admin/produtos', { 
        replace: true,
        state: { successMessage: `Produto "${data.name}" criado com sucesso!` }
      });
      return;
      
    } catch (error: any) {
      console.error('ProductCreate - Erro completo:', error);
      
      if (error.name === 'AbortError') {
        console.log('ProductCreate - Operação cancelada');
        return;
      }
      
      // Mostrar erro específico
      const errorMessage = error.message || 'Erro desconhecido ao criar produto';
      handleError(new Error(errorMessage), 'ProductCreate');
    } finally {
      if (!didNavigate) setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Cancelar operação em andamento
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
