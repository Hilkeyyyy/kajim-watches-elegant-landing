import React, { useState, useEffect, memo, useCallback } from 'react';
import { ProductCard } from '@/components/OptimizedProductCard';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';

/**
 * FeaturedCarousel otimizado com cache global e memoização
 */
const OptimizedFeaturedCarousel = memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const featuredProducts = await productService.getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = useCallback((id: string) => {
    navigate(`/produto/${id}`);
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <div className="mb-12 xs:mb-16 px-4">
        <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center mb-6 xs:mb-8">Produtos em Destaque</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum produto em destaque disponível no momento.</p>
          <p className="text-sm mt-2">Novos produtos serão adicionados em breve!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto font-serif-elegant">
            Relógios selecionados pela nossa equipe de especialistas
          </p>
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

OptimizedFeaturedCarousel.displayName = 'OptimizedFeaturedCarousel';

export { OptimizedFeaturedCarousel as FeaturedCarousel };