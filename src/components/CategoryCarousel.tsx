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

interface Category {
  id: string;
  name: string;
  image_url?: string;
  sort_order: number;
  is_featured: boolean;
}

export const CategoryCarousel = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categoria/${categoryId}`);
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Explorar Categorias
          </h2>
          <p className="font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra nossa coleção cuidadosamente organizada por estilo e elegância
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
            {categories.map((category) => (
              <CarouselItem 
                key={category.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <div
                  onClick={() => handleCategoryClick(category.id)}
                  className="group cursor-pointer h-full"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card/80 to-card backdrop-blur-sm border-2 border-border/50 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-3 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative p-6 flex flex-col items-center space-y-6 h-full">
                      {category.image_url ? (
                        <div className="relative w-20 h-20 md:w-24 md:h-24">
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg ring-2 ring-border/20 group-hover:ring-primary/30 transition-all duration-500">
                            <img
                              src={category.image_url}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500">
                          <div className="text-2xl md:text-3xl text-primary/60 group-hover:text-primary transition-colors duration-300">
                            📦
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
                        <h3 className="font-inter font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {category.name}
                        </h3>
                        {category.is_featured && (
                          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-bold border border-primary/20 shadow-sm">
                            <span className="mr-1">⭐</span>
                            Destaque
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300" />
          <CarouselNext className="hidden md:flex -right-12 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-primary hover:border-primary text-foreground hover:text-primary-foreground transition-all duration-300" />
        </Carousel>
      </div>
    </section>
  );
};