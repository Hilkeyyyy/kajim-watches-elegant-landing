import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { convertSupabaseToProduct, SupabaseProduct } from '@/types/supabase-product';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

interface BrandCarouselProps {
  brand: string;
  title: string;
  description?: string;
}

export const BrandCarousel = ({ brand, title, description }: BrandCarouselProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .eq('brand', brand)
        .order('updated_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error(`Erro ao buscar produtos da marca ${brand}:`, error);
        setLoading(false);
        return;
      }

      if (data) {
        const convertedProducts = data.map((item: SupabaseProduct) => 
          convertSupabaseToProduct(item)
        );
        setProducts(convertedProducts);
      }

      setLoading(false);
    };

    fetchBrandProducts();
  }, [brand]);

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/10 to-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent backdrop-blur-sm"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 font-serif">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2">
            <span className="text-foreground font-semibold text-sm">✓ 100% Originais</span>
          </div>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 lg:-ml-4 pr-2 lg:pr-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 lg:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard
                  product={product}
                  onProductClick={handleProductClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-6 bg-background/80 hover:bg-background border-border" />
          <CarouselNext className="hidden sm:flex -right-6 bg-background/80 hover:bg-background border-border" />
        </Carousel>
      </div>
    </section>
  );
};