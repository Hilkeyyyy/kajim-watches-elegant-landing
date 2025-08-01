import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  image_url?: string;
  sort_order: number;
  is_featured: boolean;
}

interface CategoryFilterProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export const CategoryFilter = ({ onCategorySelect, selectedCategoryId }: CategoryFilterProps) => {
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
            Explorar por Categoria
          </h2>
          <p className="font-inter text-muted-foreground">
            {selectedCategoryId ? 'Categoria selecionada' : 'Encontre exatamente o que você procura'}
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          {/* Botão "Todos" */}
          <div className="flex justify-center">
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => onCategorySelect(null)}
              className="font-inter font-medium px-8"
              size="lg"
            >
              Todos os Produtos
            </Button>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`
                  group cursor-pointer rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover-scale
                  ${selectedCategoryId === category.id 
                    ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20' 
                    : 'border-border bg-card hover:border-primary/50'
                  }
                `}
              >
                <div className="p-4 md:p-6 flex flex-col items-center space-y-3 md:space-y-4">
                  {category.image_url && (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-muted shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="text-center space-y-2">
                    <h3 className={`font-inter font-semibold text-sm md:text-base transition-colors duration-300 ${
                      selectedCategoryId === category.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {category.name}
                    </h3>
                    {category.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Destaque
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};