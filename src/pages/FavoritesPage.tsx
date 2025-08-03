
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';
import { products } from '@/data/products';
import { convertSupabaseToProduct } from '@/types/supabase-product';

export const FavoritesPage: React.FC = () => {
  const { favorites, loading } = useFavorites();

  // Filtrar produtos favoritos
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const handleProductClick = (id: string) => {
    window.location.href = `/produto/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Carregando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Nenhum favorito ainda</h1>
            <p className="text-muted-foreground mb-8">
              Adicione produtos aos favoritos para vê-los aqui.
            </p>
            <Link to="/">
              <Button>Descobrir Produtos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Favoritos</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={convertSupabaseToProduct(product)}
              onProductClick={handleProductClick}
            />
          ))}
        </div>

        {favoriteProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Alguns produtos favoritos não foram encontrados.
            </p>
            <Link to="/">
              <Button>Ver Todos os Produtos</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
