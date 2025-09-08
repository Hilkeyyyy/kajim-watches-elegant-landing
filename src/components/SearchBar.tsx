import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { searchService } from '@/services/searchService';
import { formatPrice } from '@/utils/priceUtils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showResults?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Buscar relógios premium...", 
  className = "",
  showResults = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const searchProducts = useCallback(async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const products = await searchService.searchProducts(term.trim(), 8);
      setResults(products);
      setShowDropdown(products.length > 0 && showResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  }, [showResults]);

  // Usar debounced search do serviço
  const handleSearchInput = useCallback((term: string) => {
    if (!term.trim() || term.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    searchService.debouncedSearch(term, (products) => {
      if (!isMounted.current) return;
      const safeProducts = Array.isArray(products) ? products : [];
      setResults(safeProducts);
      setShowDropdown(safeProducts.length > 0 && showResults);
      setIsLoading(false);
    }, 8);
  }, [showResults]);

  useEffect(() => {
    handleSearchInput(searchTerm);
  }, [searchTerm, handleSearchInput]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowDropdown(false);
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-12 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border bg-card/95 backdrop-blur-xl">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-muted-foreground">Buscando...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.filter((product) => product && product.id).map((product) => {
                  const productImage = product.image || product.images?.[0] || '/placeholder.svg';
                  const productBrand = product?.brand ?? '';
                  const productName = product?.name ?? '';
                  const productPrice = product?.price ?? '0';
                  
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    >
                      <img
                        src={productImage}
                        alt={productName || 'Produto'}
                        className="w-12 h-12 object-cover rounded-lg bg-muted/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          <span className="notranslate" translate="no">{productBrand}</span> <span className="notranslate" translate="no">{productName}</span>
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {formatPrice(productPrice)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearch}
                    className="w-full justify-center text-primary hover:bg-primary/10 font-medium"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Ver todos os resultados para "{searchTerm}"
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-6">
                <div className="text-center space-y-2">
                  <Search className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
                  <p className="text-xs text-muted-foreground/60">Tente buscar com termos diferentes</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};