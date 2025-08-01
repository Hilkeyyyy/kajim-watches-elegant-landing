import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { convertSupabaseToProduct } from "@/types/supabase-product";
import { Product } from "@/types/product";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";

export const OutOfStockCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOutOfStockProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .eq('status', 'active')
          .eq('stock_status', 'out_of_stock')
          .order('updated_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching out of stock products:', error);
        } else if (data) {
          setProducts(data.map(convertSupabaseToProduct));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStockProducts();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-playfair font-semibold mb-6 text-center">Produtos Esgotados</h2>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Não exibe a seção se não há produtos esgotados
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-semibold mb-3 text-foreground">
          Produtos Esgotados
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Relógios que acabaram rapidamente - fique atento para reposições
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <ProductCard 
                product={product} 
                onProductClick={handleProductClick}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
};