
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
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
        .order('updated_at', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const convertedProducts = data.map((item: SupabaseProduct) => convertSupabaseToProduct(item));
        const filtered = convertedProducts.filter((p) => p.is_featured || (p.badges || []).some((b) => ['DESTAQUE','Destaque'].includes(b)));
        setProducts(filtered);
      }

      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

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
