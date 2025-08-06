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
        .ilike('brand', `%${brand}%`)
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
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-semibold text-foreground mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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