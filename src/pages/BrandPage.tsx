import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { convertSupabaseToProduct, SupabaseProduct } from '@/types/supabase-product';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const BrandPage = () => {
  const { brand } = useParams<{ brand: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      fetchBrandProducts(decodeURIComponent(brand));
    }
  }, [brand]);

  const fetchBrandProducts = async (brandName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('brand', brandName)
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const convertedProducts = data.map((item: SupabaseProduct) => 
          convertSupabaseToProduct(item)
        );
        setProducts(convertedProducts);
      }
    } catch (error) {
      console.error(`Erro ao buscar produtos da marca ${brandName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const brandName = brand ? decodeURIComponent(brand) : 'Marca';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-serif">
              {brandName}
            </h1>
            <p className="text-muted-foreground font-light">
              {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">Nenhum produto encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Não encontramos produtos da marca "{brandName}" no momento.
            </p>
            <Button asChild>
              <Link to="/">
                Voltar à página inicial
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
