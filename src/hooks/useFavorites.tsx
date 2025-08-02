import { useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';

/**
 * Hook otimizado para gerenciar favoritos com sincronização correta
 * Corrige problemas de contagem e sincronização entre componentes
 */
export const useFavorites = () => {
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    isLoading,
  } = useApp();

  // Função para adicionar aos favoritos
  const addToFavorites = useCallback((productId: string, productName: string) => {
    if (!isFavorite(productId)) {
      toggleFavorite(productId, productName);
    }
  }, [isFavorite, toggleFavorite]);

  // Função para remover dos favoritos
  const removeFromFavorites = useCallback((productId: string, productName: string) => {
    if (isFavorite(productId)) {
      toggleFavorite(productId, productName);
    }
  }, [isFavorite, toggleFavorite]);

  // Contagem sincronizada diretamente do array
  const count = favorites.length;

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount: () => count,
    count,
    isLoading,
  };
};