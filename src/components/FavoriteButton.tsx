import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
}

export const FavoriteButton = ({ productId, productName }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("kajim-favorites") || "[]");
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("kajim-favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== productId);
      localStorage.setItem("kajim-favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removido dos favoritos",
        description: `${productName} foi removido da sua lista de favoritos.`,
      });
    } else {
      const newFavorites = [...favorites, productId];
      localStorage.setItem("kajim-favorites", JSON.stringify(newFavorites));
      setIsFavorite(true);
      toast({
        title: "Adicionado aos favoritos",
        description: `${productName} foi adicionado à sua lista de favoritos.`,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      className={`transition-colors duration-300 ${
        isFavorite 
          ? "text-red-600 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600"
      }`}
    >
      <Heart 
        className={`w-6 h-6 transition-all duration-300 ${
          isFavorite ? "fill-current scale-110" : ""
        }`} 
      />
    </Button>
  );
};