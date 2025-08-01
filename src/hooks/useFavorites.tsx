import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("kajim-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveFavorites = (newFavorites: string[]) => {
    localStorage.setItem("kajim-favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addToFavorites = (productId: string, productName: string) => {
    const newFavorites = [...favorites, productId];
    saveFavorites(newFavorites);
    toast({
      title: "Adicionado aos favoritos",
      description: `${productName} foi adicionado à sua lista de favoritos.`,
    });
  };

  const removeFromFavorites = (productId: string, productName: string) => {
    const newFavorites = favorites.filter(id => id !== productId);
    saveFavorites(newFavorites);
    toast({
      title: "Removido dos favoritos",
      description: `${productName} foi removido da sua lista de favoritos.`,
    });
  };

  const toggleFavorite = (productId: string, productName: string) => {
    if (favorites.includes(productId)) {
      removeFromFavorites(productId, productName);
    } else {
      addToFavorites(productId, productName);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount
  };
};