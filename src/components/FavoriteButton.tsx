
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptimizedFavorites } from "@/hooks/useOptimizedFavorites";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
}

export const FavoriteButton = React.memo(({ productId, productName }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite, isLoading } = useOptimizedFavorites();
  const isProductFavorite = isFavorite(productId);

  const handleToggle = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('💖 FavoriteButton clicked:', {
      productId,
      productName,
      currentlyFavorite: isProductFavorite,
      isLoading
    });

    if (!isLoading) {
      toggleFavorite(productId, productName);
    }
  }, [toggleFavorite, productId, productName, isProductFavorite, isLoading]);

  // Log do estado atual para debug
  React.useEffect(() => {
    console.log('❤️ FavoriteButton render:', {
      productId,
      productName,
      isProductFavorite,
      isLoading
    });
  }, [productId, productName, isProductFavorite, isLoading]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all duration-300 transform hover:scale-105 ${
        isProductFavorite 
          ? "text-red-600 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
