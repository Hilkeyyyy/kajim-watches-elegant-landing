import { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useOptimizedFavorites } from "@/hooks/useOptimizedFavorites";
import Header from "@/components/Header";

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<typeof products>([]);
  const { favorites } = useOptimizedFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const favoriteItems = products.filter(product => favorites.includes(product.id));
    setFavoriteProducts(favoriteItems);
  }, [favorites]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary">
                Meus Favoritos
              </h1>
              <p className="font-inter text-muted-foreground mt-2">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
              </p>
            </div>
          </div>

          {/* Favorites Grid */}
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {favoriteProducts.map((product) => (
                 <ProductCard 
                   key={product.id} 
                   product={product}
                   onProductClick={(id) => navigate(`/produto/${id}`)}
                 />
               ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-playfair text-2xl font-semibold text-primary mb-2">
                Nenhum favorito ainda
              </h2>
              <p className="font-inter text-muted-foreground mb-6">
                Adicione produtos aos seus favoritos para vê-los aqui
              </p>
              <Button
                variant="luxury"
                onClick={() => navigate("/")}
              >
                Explorar Produtos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;