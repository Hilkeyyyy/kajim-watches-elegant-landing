import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  description: string;
  badges?: string[];
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  details: {
    brand: string;
    model?: string;
    movement?: string;
    case_size?: string;
    material?: string;
    water_resistance?: string;
    warranty?: string;
  };
}

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id]);

  const fetchCategoryAndProducts = async () => {
    try {
      // Buscar categoria
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Buscar produtos da categoria
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', id)
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      
      // Mapear produtos para o formato esperado
      const mappedProducts = productsData?.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        image: product.image_url || '',
        description: product.description || '',
        badges: product.badges || [],
        stock_status: product.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock',
        details: {
          brand: product.brand,
          model: product.model,
          movement: product.movement,
          case_size: product.case_size,
          material: product.material,
          water_resistance: product.water_resistance,
          warranty: product.warranty,
        }
      })) || [];

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Erro ao buscar categoria e produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
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
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="font-playfair text-2xl font-bold text-primary mb-4">
              Categoria não encontrada
            </h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
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
          <div className="flex items-center mb-6">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="font-inter text-lg text-muted-foreground mb-6">
                  {category.description}
                </p>
              )}
              <Badge variant="secondary" className="text-sm">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'}
              </Badge>
            </div>
            
            {category.image_url && (
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lista de Produtos */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductClick(product.id)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="font-inter text-muted-foreground mb-6">
                Esta categoria ainda não possui produtos disponíveis.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Ver todos os produtos
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;