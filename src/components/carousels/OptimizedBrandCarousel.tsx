import React, { useState, useEffect, memo, useCallback } from 'react';
import { ProductCard } from '@/components/OptimizedProductCard';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';

interface BrandCarouselProps {
  brand: string;
  title: string;
  description?: string;
}

/**
 * BrandCarousel otimizado com cache global e memoização
 */
const OptimizedBrandCarousel = memo(({ brand, title, description }: BrandCarouselProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const brandProducts = await productService.getBrandProducts(brand);
        setProducts(brandProducts);
      } catch (error) {
        console.error(`Erro ao buscar produtos da marca ${brand}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brand]);

  const handleProductClick = useCallback((id: string) => {
    navigate(`/produto/${id}`);
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-muted/10 to-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent"></div>
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
          <CarouselContent className="-ml-1 lg:-ml-2 pr-1 lg:pr-2">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 lg:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3">
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
});

OptimizedBrandCarousel.displayName = 'OptimizedBrandCarousel';

export { OptimizedBrandCarousel as BrandCarousel };