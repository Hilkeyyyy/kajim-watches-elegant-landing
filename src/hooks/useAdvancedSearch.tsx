import { useState, useCallback, useRef } from 'react';
import { Product } from '@/types/product';
import { advancedSearchService } from '@/services/advancedSearchService';
import { debounce } from '@/utils/debounce';

interface UseAdvancedSearchReturn {
  results: Product[];
  isLoading: boolean;
  error: string | null;
  searchProducts: (query: string) => void;
  clearSearch: () => void;
}

/**
 * Hook para gerenciar pesquisa avançada
 */
export const useAdvancedSearch = (): UseAdvancedSearchReturn => {
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Função debounced para pesquisa
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      // Cancelar busca anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Query vazia
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Criar novo AbortController
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Buscar produtos
        const searchResults = await advancedSearchService.searchProducts(query);
        
        // Verificar se a busca não foi cancelada
        if (!abortController.signal.aborted) {
          setResults(searchResults);
        }
      } catch (err) {
        if (!abortControllerRef.current?.signal.aborted) {
          const errorMessage = err instanceof Error ? err.message : 'Erro na busca';
          setError(errorMessage);
          setResults([]);
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300),
    []
  );

  // Função de busca principal
  const searchProducts = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setResults([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchProducts,
    clearSearch
  };
};