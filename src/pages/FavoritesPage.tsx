
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import { useFavorites } from '@/hooks/useFavorites';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoriteProducts();
  }, [favorites]);

  const loadFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const products: Product[] = [];
      
      // Carregar cada produto favorito
      for (const productId of favorites) {
        const response = await apiService.getProduct(productId);
        if (response.success && response.data) {
          products.push(response.data);
        }
      }
      
      setFavoriteProducts(products);
    } catch (error) {
      console.error('Erro ao carregar produtos favoritos:', error);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    window.location.href = `/produto/${productId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-80 rounded-lg"></div>
              ))}
            </div>
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
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-red-500 mr-3" />
          <h1 className="text-3xl font-bold">Meus Favoritos</h1>
          <span className="ml-4 text-muted-foreground">
            ({favorites.length} {favorites.length === 1 ? 'item' : 'itens'})
          </span>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Nenhum produto favorito</h2>
            <p className="text-muted-foreground mb-8">
              Adicione produtos aos seus favoritos para vê-los aqui.
            </p>
            <Button asChild>
              <Link to="/">Explorar Produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
