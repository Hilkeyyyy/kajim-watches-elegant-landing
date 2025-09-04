import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { convertSupabaseToProduct, SupabaseProduct } from '@/types/supabase-product';
import { Card, CardContent } from '@/components/ui/card';
import { debounce } from '@/utils/debounce';

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

  const debouncedSearch = React.useMemo(() => debounce((t: string) => searchProducts(t), 250), []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, debouncedSearch]);

  const searchProducts = async (term: string) => {
    const termSanitized = term.trim();
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .eq('status', 'active')
        .or(`(name.ilike.%${termSanitized}%,brand.ilike.%${termSanitized}%,description.ilike.%${termSanitized}%)`)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;

      const products = (data as SupabaseProduct[] || []).map(convertSupabaseToProduct);
      setResults(products);
      setShowDropdown(products.length > 0 && showResults);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
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
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image || product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate"><span className="notranslate" translate="no">{product.brand}</span> <span className="notranslate" translate="no">{product.name}</span></p>
                      <p className="text-xs text-muted-foreground truncate">
                        {typeof product.price === 'string' 
                          ? `R$ ${parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : `R$ ${Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        }
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearch}
                    className="w-full justify-center text-primary hover:bg-primary/10"
                  >
                    Ver todos os resultados para "{searchTerm}"
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};