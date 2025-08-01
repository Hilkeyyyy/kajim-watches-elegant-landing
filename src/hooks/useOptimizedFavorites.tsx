import { useApp } from '@/contexts/AppContext';

// Hook otimizado que mantém compatibilidade com a API anterior
export const useOptimizedFavorites = () => {
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
  } = useApp();

  // Funções individuais para compatibilidade
  const addToFavorites = (productId: string, productName: string) => {
    if (!isFavorite(productId)) {
      toggleFavorite(productId, productName);
    }
  };

  const removeFromFavorites = (productId: string, productName: string) => {
    if (isFavorite(productId)) {
      toggleFavorite(productId, productName);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
  };
};

// Alias para compatibilidade
export const useFavorites = useOptimizedFavorites;