import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { convertSupabaseToProduct, SupabaseProduct } from '@/types/supabase-product';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

export const FeaturedCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .overlaps('badges', ['DESTAQUE'])
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
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

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <div className="mb-12 xs:mb-16 px-4">
        <h2 className="text-2xl xs:text-3xl font-bold text-center mb-6 xs:mb-8">Produtos em Destaque</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum produto em destaque disponível no momento.</p>
          <p className="text-sm mt-2">Novos produtos serão adicionados em breve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 xs:mb-16 px-4">
      <h2 className="text-2xl xs:text-3xl font-bold text-center mb-6 xs:mb-8">Produtos em Destaque</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] xs:basis-[80%] sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <ProductCard
                  product={product}
                  onProductClick={handleProductClick}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden xs:flex -left-4 lg:-left-12" />
        <CarouselNext className="hidden xs:flex -right-4 lg:-right-12" />
      </Carousel>
    </div>
  );
};