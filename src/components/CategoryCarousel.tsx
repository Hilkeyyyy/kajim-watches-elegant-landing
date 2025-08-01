import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  sort_order: number;
  is_featured: boolean;
}

interface CategoryCarouselProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export const CategoryCarousel = ({ onCategorySelect, selectedCategoryId }: CategoryCarouselProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-2">
            Categorias
          </h2>
          <p className="font-inter text-muted-foreground">
            Explore nossa coleção por categoria
          </p>
        </div>

        <div className="relative">
          {/* Botão "Todos" */}
          <div className="flex justify-center mb-6">
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => onCategorySelect(null)}
              className="font-inter font-medium"
            >
              Todos os Produtos
            </Button>
          </div>

          {/* Carousel de Categorias */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {categories.map((category) => (
                <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Button
                      variant={selectedCategoryId === category.id ? "default" : "outline"}
                      onClick={() => onCategorySelect(category.id)}
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2 font-inter"
                    >
                      {category.image_url && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <span className="font-medium text-sm">{category.name}</span>
                        {category.is_featured && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};