import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { SearchResults } from './SearchResults';
import { cn } from '@/lib/utils';

interface AdvancedSearchBarProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  placeholder = "Buscar relógios...",
  className,
  onResultClick
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading, error, searchProducts } = useAdvancedSearch();

  // Buscar quando query mudar
  useEffect(() => {
    searchProducts(query);
    setIsOpen(query.trim().length > 0);
  }, [query, searchProducts]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setIsFocused(false);
    onResultClick?.();
  };

  const hasResults = results && results.length > 0;
  const showDropdown = isOpen && (hasResults || isLoading || error);

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        "bg-background border border-border rounded-lg",
        "hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        isFocused && "border-primary ring-2 ring-primary/20"
      )}>
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 bg-transparent",
            "text-sm placeholder:text-muted-foreground",
            "focus:outline-none"
          )}
          aria-label="Buscar produtos"
          aria-expanded={showDropdown ? 'true' : 'false'}
          aria-haspopup="listbox"
        />

        {/* Loading/Clear Button */}
        <div className="absolute right-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : query && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded-sm transition-colors"
              aria-label="Limpar busca"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1",
          "bg-popover border border-border rounded-lg shadow-lg",
          "animate-in slide-in-from-top-2 duration-200"
        )}>
          <SearchResults
            results={results}
            isLoading={isLoading}
            error={error}
            query={query}
            onResultClick={handleResultClick}
          />
        </div>
      )}
    </div>
  );
};