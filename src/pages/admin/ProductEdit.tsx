import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from '@/components/admin/ProductForm';
import AdminBreadcrumb from '@/components/admin/AdminBreadcrumb';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const ProductEdit = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        toast({
          title: "Erro",
          description: "Produto não encontrado",
          variant: "destructive"
        });
        navigate('/admin/produtos');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!id) return;
    
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
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!"
      });

      navigate('/admin/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/produtos');
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link to="/admin/produtos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Editar Produto
            </h1>
            <p className="text-muted-foreground">
              Edite as informações do produto "{product.name}"
            </p>
          </div>
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