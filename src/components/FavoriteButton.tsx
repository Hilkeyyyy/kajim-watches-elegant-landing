import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
}

export const FavoriteButton = ({ productId, productName }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(productId);

  const handleToggle = () => {
    toggleFavorite(productId, productName);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`transition-all duration-300 transform hover:scale-105 ${
        isProductFavorite 
          ? "text-red-600 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600"
      }`}
    >
      <Heart 
        className={`w-6 h-6 transition-all duration-300 ${
          isProductFavorite ? "fill-current scale-110" : ""
        }`} 
      />
    </Button>
  );
};