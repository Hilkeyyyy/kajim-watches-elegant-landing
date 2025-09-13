import React, { useState, useEffect, memo, useCallback } from 'react';
import { OptimizedProductCard } from '@/components/OptimizedProductCard';
import { Product } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';

/**
 * OffersCarousel otimizado
 */
export const OffersCarousel = memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffersProducts = async () => {
      try {
        const offersProducts = await productService.getOffersProducts();
        setProducts(offersProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos em oferta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersProducts();
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
        <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center mb-6 xs:mb-8">Ofertas Especiais</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma oferta disponível no momento.</p>
          <p className="text-sm mt-2">Fique atento às nossas promoções!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-red-50/50 via-background to-red-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Ofertas Especiais
          </h2>
          <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto font-serif-elegant">
            Não perca essas oportunidades únicas
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
                <OptimizedProductCard
                  product={product}
                  variant="compact"
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

/**
 * NewProductsCarousel otimizado
 */
export const NewProductsCarousel = memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const newProducts = await productService.getNewProducts();
        setProducts(newProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos novos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
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
        <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center mb-6 xs:mb-8">Produtos Novos</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum produto novo disponível no momento.</p>
          <p className="text-sm mt-2">Novidades chegam em breve!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-50/50 via-background to-green-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Produtos Novos
          </h2>
          <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto font-serif-elegant">
            As últimas novidades em relógios de luxo
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
                <OptimizedProductCard
                  product={product}
                  variant="compact"
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

/**
 * OutOfStockCarousel otimizado
 */
export const OutOfStockCarousel = memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        const outOfStockProducts = await productService.getOutOfStockProducts();
        setProducts(outOfStockProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos fora de estoque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStockProducts();
  }, []);

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
    <section className="py-16 px-4 bg-gradient-to-br from-orange-50/50 via-background to-orange-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Edições Limitadas
          </h2>
          <p className="text-subtitle text-muted-foreground max-w-2xl mx-auto font-serif-elegant">
            Peças exclusivas e raras para colecionadores
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
                <OptimizedProductCard
                  product={product}
                  variant="compact"
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

OffersCarousel.displayName = 'OffersCarousel';
NewProductsCarousel.displayName = 'NewProductsCarousel';
OutOfStockCarousel.displayName = 'OutOfStockCarousel';