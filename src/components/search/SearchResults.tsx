import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { LazyImage } from '@/components/LazyImage';
import { cn } from '@/lib/utils';
import { Search, AlertCircle } from 'lucide-react';

interface SearchResultsProps {
  results: Product[];
  isLoading: boolean;
  error: string | null;
  query: string;
  onResultClick: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  query,
  onResultClick
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          <span className="text-sm">Buscando...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Erro na busca. Tente novamente.</span>
        </div>
      </div>
    );
  }

  // No results
  if (!results || results.length === 0) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center space-y-2 text-muted-foreground">
          <Search className="h-6 w-6" />
          <span className="text-sm text-center">
            Nenhum resultado encontrado para "<span className="font-medium text-foreground">{query}</span>"
          </span>
          <span className="text-xs text-center">
            Tente buscar por marca ou nome do produto
          </span>
        </div>
      </div>
    );
  }

  // Limitar a 6 resultados no preview
  const displayResults = results.slice(0, 6);

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Results */}
      <div className="p-2 space-y-1">
        {displayResults.map((product) => (
          <Link
            key={product.id}
            to={`/produto/${product.id}`}
            onClick={onResultClick}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-lg",
              "hover:bg-muted/50 transition-colors",
              "focus:outline-none focus:bg-muted/50"
            )}
          >
            {/* Product Image */}
            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted">
              {(product.image || product.images?.[0]) ? (
                <LazyImage
                  src={product.image || product.images?.[0] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-foreground truncate">
                {product.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {product.brand}
              </p>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <p className="font-semibold text-sm text-primary">
                R$ {Number(product.price).toLocaleString('pt-BR')}
              </p>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <p className="text-xs text-muted-foreground line-through">
                  R$ {Number(product.original_price).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* More results indicator */}
      {results.length > 6 && (
        <div className="border-t border-border p-3 bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            +{results.length - 6} resultados adicionais
          </p>
        </div>
      )}
    </div>
  );
};