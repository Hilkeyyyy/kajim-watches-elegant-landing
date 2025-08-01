import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { supabase } from "@/integrations/supabase/client";

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
            Explorar Categorias
          </h2>
          <p className="font-inter text-muted-foreground text-lg">
            Descubra nossa coleção organizada por estilo
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer rounded-2xl border-2 border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/50 hover-scale"
            >
              <div className="p-6 flex flex-col items-center space-y-4">
                {category.image_url && (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-muted shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <h3 className="font-inter font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </h3>
                  {category.is_featured && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      ⭐ Destaque
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};