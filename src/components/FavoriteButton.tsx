
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
}

export const FavoriteButton = React.memo(({ productId, productName }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite, loading } = useFavorites();
  const isProductFavorite = isFavorite(productId);

  const handleToggle = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!loading) {
      toggleFavorite(productId);
    }
  }, [toggleFavorite, productId, loading]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={`transition-all duration-300 transform hover:scale-105 ${
        isProductFavorite 
          ? "text-red-600 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart 
        className={`w-6 h-6 transition-all duration-300 ${
          isProductFavorite ? "fill-current scale-110" : ""
        }`} 
      />
    </Button>
  );
});

FavoriteButton.displayName = "FavoriteButton";
