
import { useApp } from '@/contexts/AppContext';
import { useEffect, useCallback } from 'react';

// Hook otimizado com logs de debug para resolver problemas de contagem
export const useOptimizedFavorites = () => {
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    isLoading,
  } = useApp();

  // Debug log para monitorar estado dos favoritos
  useEffect(() => {
    console.log('🔄 useOptimizedFavorites - Estado dos favoritos:', {
      favorites: favorites,
      count: favorites.length,
      isLoading: isLoading,
      timestamp: new Date().toISOString()
    });
  }, [favorites, isLoading]);

  // Funções individuais para compatibilidade com memoização adequada
  const addToFavorites = useCallback((productId: string, productName: string) => {
    console.log('➕ Adicionando aos favoritos:', { productId, productName });
    if (!isFavorite(productId)) {
      toggleFavorite(productId, productName);
    } else {
      console.log('⚠️ Produto já está nos favoritos:', productId);
    }
  }, [isFavorite, toggleFavorite]);

  const removeFromFavorites = useCallback((productId: string, productName: string) => {
    console.log('➖ Removendo dos favoritos:', { productId, productName });
    if (isFavorite(productId)) {
      toggleFavorite(productId, productName);
    } else {
      console.log('⚠️ Produto não está nos favoritos:', productId);
    }
  }, [isFavorite, toggleFavorite]);

  // Função de contagem melhorada com logs
  const getCount = useCallback(() => {
    const count = getFavoritesCount();
    console.log('📊 Contagem de favoritos:', {
      count,
      favoritesArray: favorites,
      arrayLength: favorites.length
    });
    return count;
  }, [getFavoritesCount, favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount: getCount,
    isLoading,
  };
};

// Alias para compatibilidade
export const useFavorites = useOptimizedFavorites;
