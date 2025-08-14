
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/contexts/AppContext";

interface FavoriteButtonProps {
  productId: string;
  productName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FavoriteButton = React.memo(({ productId, productName = '', size = "md", className }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite, isLoading } = useApp();
  const isProductFavorite = isFavorite(productId);

  const handleToggle = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoading) {
      toggleFavorite(productId, productName);
    }
  }, [toggleFavorite, productId, productName, isLoading]);

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={`transition-all duration-300 transform hover:scale-105 ${
        isProductFavorite 
          ? "text-red-600 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
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
