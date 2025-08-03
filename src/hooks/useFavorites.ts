
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar favoritos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites');
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
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  const addToFavorites = (productId: string) => {
    setFavorites(current => {
      if (current.includes(productId)) return current;
      return [...current, productId];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(current => current.filter(id => id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    count: favorites.length
  };
};
