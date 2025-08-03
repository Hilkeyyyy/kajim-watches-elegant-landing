import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from '@/components/admin/ProductForm';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

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
  status?: 'active' | 'inactive' | 'discontinued';
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

const ProductCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      
      const productData = {
        name: data.name,
        price: parseFloat(data.price),
        brand: data.brand,
        model: data.model,
        description: data.description,
        stock_quantity: data.stock_quantity || 0,
        is_visible: data.is_visible ?? true,
        is_featured: data.is_featured ?? false,
        status: (data.status as 'active' | 'inactive' | 'out_of_stock') || 'active',
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
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/admin/produtos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Criar Produto
            </h1>
            <p className="text-muted-foreground">
              Adicione um novo produto ao catálogo
            </p>
          </div>
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