import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ProductForm } from '@/components/admin/ProductForm';
import type { ProductFormData } from '@/components/admin/forms/ProductFormCore';
import { useAdminDataStore } from '@/store/useAdminDataStore';
import { buildSafeProductPayload, validateProductData } from '@/utils/productUtils';

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
          setIsLoading(true);

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
          
          console.log('ProductCreate - Payload seguro:', productPayload);
          
          const { error } = await supabase
            .from('products')
            .insert(productPayload);

          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }

          console.log('ProductCreate - Produto criado com sucesso');
          
          // Atualizar cache silenciosamente
          fetchProducts({ force: true }).catch(console.warn);
          
          // Navegar imediatamente e mostrar sucesso na página de destino
          navigate('/admin/produtos', { 
            replace: true, 
            state: { successMessage: "Produto criado com sucesso!" }
          });
          
          resolve();
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('ProductCreate - Operação cancelada');
            resolve();
            return;
          }
          console.error('ProductCreate - Erro:', error);
          handleError(error, 'ProductCreate');
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