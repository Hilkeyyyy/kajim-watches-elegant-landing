import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  brand: string;
  badges: string[];
  custom_tags: string[];
  stock_status: string;
  stock_quantity: number;
  category_id: string;
  is_visible: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const fetchCategoryAndProducts = async () => {
    if (!categoryId) return;

    try {
      // Buscar informações da categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Buscar produtos da categoria
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Erro ao buscar categoria e produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Categoria não encontrada</h1>
            <Button onClick={() => navigate('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero da Categoria */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 font-inter"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
          
          <div className="text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="font-inter text-muted-foreground mt-4">
              {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: `R$ ${product.price.toFixed(2).replace('.', ',')}`,
                      image: product.image_url || '/placeholder.svg',
                      description: product.description,
                      badges: product.badges,
                      custom_tags: product.custom_tags,
                      stock_status: product.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock',
                      stock_quantity: product.stock_quantity,
                      details: {
                        brand: product.brand
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="font-inter text-xl font-semibold text-foreground mb-2">
                Nenhum produto disponível
              </h3>
              <p className="font-inter text-muted-foreground mb-6">
                Esta categoria ainda não possui produtos cadastrados.
              </p>
              <Button onClick={() => navigate('/')}>
                Explorar outros produtos
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;