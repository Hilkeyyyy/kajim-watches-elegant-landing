
import { useState, useEffect, useCallback } from 'react';

interface UseFavoritesReturn {
  favorites: string[];
  loading: boolean;
  isLoading: boolean; // Adicionar alias para compatibilidade
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  count: number;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar favoritos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kajim-favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  }, []);

  // Salvar no localStorage sempre que favorites mudar
  useEffect(() => {
    try {
      localStorage.setItem('kajim-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  const addToFavorites = useCallback((productId: string) => {
    setFavorites(current => {
      if (current.includes(productId)) return current;
      return [...current, productId];
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites(current => current.filter(id => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(current => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  return {
    favorites,
    loading,
    isLoading: loading, // Alias para compatibilidade
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
};
