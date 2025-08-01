import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { convertSupabaseToProduct } from "@/types/supabase-product";
import { Product } from "@/types/product";
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
        // Produtos criados nos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_visible', true)
          .eq('status', 'active')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching new products:', error);
        } else if (data) {
          setProducts(data.map(convertSupabaseToProduct));
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
    return null; // Não exibe a seção se não há produtos novos
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-playfair font-semibold mb-3 text-foreground">
          Novidades
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Descubra os últimos lançamentos em relógios originais
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