import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { SupabaseProduct, convertSupabaseToProduct } from '@/types/supabase-product';
import { MobileNavigation } from '@/components/MobileNavigation';

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading } = useApp();
  const navigate = useNavigate();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data: productsData, error } = await supabase
          .from('products')
          .select('*')
          .in('id', favorites)
          .eq('is_visible', true)
          .eq('status', 'active');

        if (error) throw error;

        const products = (productsData as SupabaseProduct[] || []).map(convertSupabaseToProduct);
        setFavoriteProducts(products);
      } catch (error) {
        console.error('Erro ao buscar produtos favoritos:', error);
        setFavoriteProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleProductClick = (id: string) => {
    navigate(`/produto/${id}`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">Carregando favoritos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="relative">
                <Heart className="w-20 h-20 text-muted-foreground/40 mx-auto" />
                <Sparkles className="w-6 h-6 text-accent absolute -top-2 -right-2" />
              </div>
              <div className="space-y-3">
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-foreground">
                  Nenhum favorito ainda
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Descubra relógios incríveis e adicione aos seus favoritos para encontrá-los facilmente depois.
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full sm:w-auto">
                    Explorar Relógios
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  💡 Dica: Clique no ícone ❤️ nos produtos para favoritá-los
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="space-y-6 sm:space-y-8">
          {/* Breadcrumb and Navigation */}
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar para Home</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
            </Link>
          </div>

          {/* Page Title and Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-accent/20 to-moss/20 rounded-lg">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Meus Favoritos
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {favorites.length} {favorites.length === 1 ? 'relógio favoritado' : 'relógios favoritados'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8 sm:mt-12">
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-screen-2xl mx-auto">
              {favoriteProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in w-full max-w-[300px] mx-auto"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onProductClick={handleProductClick}
                    showBadgesAtBase
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 sm:p-12 text-center bg-muted/20 border-dashed">
              <CardContent>
                <div className="space-y-4">
                  <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">Alguns favoritos não foram encontrados</h3>
                    <p className="text-muted-foreground text-sm">
                      Alguns produtos podem ter sido removidos do catálogo.
                    </p>
                  </div>
                  <Link to="/">
                    <Button variant="outline">Ver Todos os Produtos</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Empty State Suggestion */}
        {favoriteProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Gostou dos seus favoritos? Explore mais relógios incríveis.
              </p>
              <Link to="/">
                <Button variant="outline">
                  Explorar Mais Relógios
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default FavoritesPage;
