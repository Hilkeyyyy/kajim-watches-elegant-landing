import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';
import { AddToCartButtonAnimated } from '@/components/AddToCartButtonAnimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { StockStatus } from '@/components/StockStatus';
import { useOptimizedIntersection } from '@/hooks/useOptimizedIntersection';
import { FluidWrapper } from '@/components/FluidWrapper';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface OptimizedProductCardProps {
  product: Product;
  priority?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onProductClick?: (id: string) => void;
}

/**
 * Card de produto ultra-otimizado para máxima fluidez
 * Usa memoization, lazy loading e animações suaves
 */
export const OptimizedProductCard = memo<OptimizedProductCardProps>(({ 
  product, 
  priority = false,
  variant = 'default',
  onProductClick
}) => {
  const navigate = useNavigate();
  const { elementRef, isIntersecting } = useOptimizedIntersection({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(product.id);
    } else {
      navigate(`/produto/${product.id}`);
    }
  }, [navigate, product.id, onProductClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const cardVariants = {
    default: 'h-[400px]',
    compact: 'h-[350px]',
    featured: 'h-[450px]'
  };

  return (
    <FluidWrapper 
      className={cn(
        'w-full max-w-sm mx-auto',
        cardVariants[variant]
      )}
      smoothEntry={!priority}
    >
      <Card 
        ref={elementRef}
        className={cn(
          'group relative h-full cursor-pointer overflow-hidden',
          'transition-all duration-300 ease-out',
          'hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1',
          'border-border/50 hover:border-primary/30',
          'gpu-accelerated'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <LazyImage
            src={product.image}
            alt={product.name}
            className={cn(
              'w-full object-cover transition-transform duration-500',
              'group-hover:scale-110',
              variant === 'compact' ? 'h-48' : variant === 'featured' ? 'h-64' : 'h-56'
            )}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                Novo
              </Badge>
            )}
            {product.original_price && (
              <Badge variant="destructive">
                Oferta
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FavoriteButton 
              productId={product.id} 
              size="sm"
              className="bg-white/90 hover:bg-white shadow-md"
            />
          </div>
        </div>

        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {product.name}
              </h3>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            <StockStatus 
              stockStatus={product.stock_status} 
              quantity={product.stock_quantity} 
            />
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.original_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    R$ {product.original_price}
                  </span>
                )}
                <span className="font-bold text-lg text-primary">
                  R$ {product.price}
                </span>
              </div>
            </div>
            
            {/* Lazy load do botão apenas quando visível */}
            {isIntersecting && (
              <AddToCartButtonAnimated 
                product={product}
                size="sm"
                className="w-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </FluidWrapper>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

// Export compatível com nome antigo
export const ProductCard = OptimizedProductCard;