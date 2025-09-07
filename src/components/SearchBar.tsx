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
    setIsLoading(true);
    try {
      // Tentar usar função de busca segura primeiro
      const { data, error } = await supabase.rpc('search_products_secure', {
        search_term: term,
        result_limit: 8
      });

      if (error) {
        console.warn('Erro na busca segura, tentando busca direta:', error);
        throw error;
      }

      // Converter para formato Product
      const products: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        description: item.description || '',
        price: item.price.toString(),
        image: item.image_url,
        images: item.images || [],
        features: [],
        created_at: item.created_at,
        updated_at: item.created_at
      }));
      
      setResults(products);
      setShowDropdown(products.length > 0 && showResults);
    } catch (error) {
      console.error('Erro na busca:', error);
      
      // Fallback: busca direta na tabela de produtos
      try {
        const sanitizedTerm = term.trim().toLowerCase();
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('products')
          .select('id, name, brand, description, price, image_url, images, created_at')
          .eq('is_visible', true)
          .eq('status', 'active')
          .or(`name.ilike.%${sanitizedTerm}%,brand.ilike.%${sanitizedTerm}%,description.ilike.%${sanitizedTerm}%`)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(8);

        if (fallbackError) throw fallbackError;

        const fallbackProducts: Product[] = (fallbackData || []).map(item => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          description: item.description || '',
          price: item.price.toString(),
          image: item.image_url,
          images: item.images || [],
          features: [],
          created_at: item.created_at,
          updated_at: item.created_at
        }));
        
        setResults(fallbackProducts);
        setShowDropdown(fallbackProducts.length > 0 && showResults);
      } catch (fallbackError) {
        console.error('Erro no fallback de busca:', fallbackError);
        setResults([]);
        setShowDropdown(false);
      }
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