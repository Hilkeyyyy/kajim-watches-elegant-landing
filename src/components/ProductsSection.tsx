import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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

const ProductsSection = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      const products = data || [];
      setAllProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    
    if (categoryId === null) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => product.category_id === categoryId);
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto flex justify-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Category Filter */}
      <CategoryFilter 
        onCategorySelect={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
      />

      {/* Products Section */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-4">
              {selectedCategoryId ? 'Produtos Filtrados' : 'Coleção Premium'}
            </h2>
            <p className="font-inter text-muted-foreground text-lg font-light">
              {selectedCategoryId ? `${filteredProducts.length} produtos encontrados` : 'Descobra nossa seleção exclusiva'}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
              <p className="font-inter text-muted-foreground text-lg">
                {selectedCategoryId ? 'Nenhum produto encontrado nesta categoria.' : 'Nenhum produto disponível no momento.'}
              </p>
              {selectedCategoryId && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="mt-4 text-primary hover:underline font-medium"
                >
                  Ver todos os produtos
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsSection;