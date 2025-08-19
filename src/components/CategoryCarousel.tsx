
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mapeamento de marcas conhecidas
const KNOWN_BRANDS = [
  'Rolex',
  'Patek Philippe', 
  'Omega',
  'Casio',
  'Seiko',
  'TAG Heuer',
  'Breitling',
  'Cartier',
  'Tissot',
  'Longines'
];

interface BrandCategory {
  name: string;
  brand: string;
  productCount: number;
  image_url?: string;
}

export const CategoryCarousel = () => {
  const [categories, setCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrandCategories();
  }, []);

  const fetchBrandCategories = async () => {
    try {
      // Buscar produtos agrupados por marca
      const { data: products, error } = await supabase
        .from('products')
        .select('brand, image_url')
        .eq('is_visible', true)
        .eq('status', 'active');

      if (error) throw error;

      // Agrupar por marca e contar produtos
      const brandCounts = products?.reduce((acc: Record<string, { count: number, image?: string }>, product) => {
        const brand = product.brand;
        if (!acc[brand]) {
          acc[brand] = { count: 0, image: product.image_url };
        }
        acc[brand].count += 1;
        // Usar a primeira imagem encontrada para a marca
        if (!acc[brand].image && product.image_url) {
          acc[brand].image = product.image_url;
        }
        return acc;
      }, {});

      // Criar categorias baseadas nas marcas
      const brandCategories: BrandCategory[] = Object.entries(brandCounts || {})
        .filter(([brand, data]) => data.count > 0)
        .sort(([a], [b]) => {
          // Priorizar marcas conhecidas
          const aKnown = KNOWN_BRANDS.includes(a);
          const bKnown = KNOWN_BRANDS.includes(b);
          
          if (aKnown && !bKnown) return -1;
          if (!aKnown && bKnown) return 1;
          
          return a.localeCompare(b);
        })
        .map(([brand, data]) => ({
          name: brand,
          brand: brand,
          productCount: data.count,
          image_url: data.image
        }));

      setCategories(brandCategories);
    } catch (error) {
      console.error('Erro ao buscar categorias por marca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (brand: string) => {
    // Navegar para página de produtos filtrados por marca
    navigate(`/marca/${encodeURIComponent(brand)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Explorar por Marca
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Descubra nossa coleção organizada pelas melhores marcas de relógios do mundo
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
            {categories.map((category, index) => (
              <CarouselItem 
                key={category.brand} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div
                  onClick={() => handleCategoryClick(category.brand)}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Image */}
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-50"
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 font-serif">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">
                      {category.productCount} {category.productCount === 1 ? 'produto' : 'produtos'}
                    </p>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-all duration-300" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300 shadow-lg" />
          <CarouselNext className="hidden md:flex -right-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
};
