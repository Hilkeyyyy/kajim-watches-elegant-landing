
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { convertSupabaseToProduct } from "@/types/supabase-product";
import { Product } from "@/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

export const NewProductsCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          console.error('Error fetching new products:', error);
        } else if (data) {
          const all = data.map(convertSupabaseToProduct);
          const threshold = new Date();
          threshold.setDate(threshold.getDate() - 30);
          const filtered = all.filter((p) => {
            const createdAt = p.created_at ? new Date(p.created_at) : null;
            const hasBadge = (p.badges || []).some((b) => ['NOVIDADE','Novidade','NOVO','Novo','LIMITADO','Limitado'].includes(b));
            return (createdAt && createdAt >= threshold) || hasBadge;
          });
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-playfair font-semibold mb-6 text-center">Novidades</h2>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair font-semibold mb-3 text-foreground">Novidades</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Os lançamentos mais recentes</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma novidade disponível no momento.</p>
          <p className="text-sm mt-2">Fique atento aos próximos lançamentos!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-foreground mb-4">
            Novidades & Limitados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Os lançamentos mais recentes e edições limitadas da nossa coleção
          </p>
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
                <div className="h-[500px]">
                  <ProductCard 
                    product={product} 
                    onProductClick={handleProductClick}
                  />
                </div>
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
