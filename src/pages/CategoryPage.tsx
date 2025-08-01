import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { SupabaseProduct, convertSupabaseToProduct } from "@/types/supabase-product";

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    try {
      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Já que removemos category_id, vamos buscar todos os produtos ativos
      // Em uma implementação real, você poderia usar tags ou outro sistema de classificação
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      const products = (productsData as SupabaseProduct[] || []).map(convertSupabaseToProduct);
      setProducts(products);
    } catch (error) {
      console.error('Erro ao buscar categoria e produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Categoria não encontrada
            </h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Category header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onProductClick={handleProductClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-inter text-muted-foreground text-lg mb-4">
              Nenhum produto encontrado nesta categoria.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Explorar outras categorias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;