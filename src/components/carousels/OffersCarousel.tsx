
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { convertSupabaseToProduct } from "@/types/supabase-product";
import { Product } from "@/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

export const OffersCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffersProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(30);

        if (error) {
          console.error('Error fetching offers products:', error);
        } else if (data) {
          const all = data.map(convertSupabaseToProduct);
          const filtered = all.filter((p) => {
            const hasBadge = (p.badges || []).some((b) => ['OFERTA','Oferta','Promoção','PROMOÇÃO','SALE','SALE!'].includes(b));
            const current = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.,]/g, '').replace(',','.')) : Number(p.price);
            const original = p.original_price ? (typeof p.original_price === 'string' ? parseFloat(p.original_price.replace(/[^0-9.,]/g, '').replace(',','.')) : Number(p.original_price)) : 0;
            return hasBadge || (original > 0 && current > 0 && current < original);
          });
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-playfair font-semibold mb-6 text-center">Ofertas Especiais</h2>
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
          <h2 className="text-3xl font-playfair font-semibold mb-3 text-foreground">Ofertas Especiais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Produtos com preços promocionais</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma oferta disponível no momento.</p>
          <p className="text-sm mt-2">Acompanhe nossas promoções!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-semibold text-foreground mb-4">
            Ofertas Especiais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aproveite preços exclusivos em relógios originais selecionados
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
                <div className="h-[400px]">
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
