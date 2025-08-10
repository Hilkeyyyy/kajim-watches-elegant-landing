
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { AddToCartButtonAnimated } from '@/components/AddToCartButtonAnimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onClick }) => {
  const { toggleFavorite, isFavorite } = useApp();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else if (onClick) {
      onClick();
    }
  };

  const mainImage = product.image || product.images[0] || '';
  
  const priceDisplay = typeof product.price === 'string' 
    ? formatPrice(parseFloat(product.price))
    : formatPrice(product.price);
  const originalDisplay = product.original_price
    ? (typeof product.original_price === 'string' ? formatPrice(parseFloat(product.original_price)) : formatPrice(product.original_price))
    : null;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-luxury hover:shadow-glow transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 rounded-xl"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div
          className="aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-xl"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          role="button"
          aria-label={`Ampliar imagem de ${product.name}`}
        >
          <img
            src={mainImage}
            alt={`Relógio ${product.brand} ${product.name}`}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.08]"
            loading="lazy"
          />
          
          
          
        </div>
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={product.id} productName={product.name} />
        </div>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-accent font-semibold uppercase tracking-[0.1em] opacity-80">
            {product.brand}
          </p>
        </div>
        
        {/* Product Name */}
        <h3 className="text-headline text-foreground line-clamp-2 leading-snug min-h-[2.8rem] sm:min-h-[3.2rem] group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        
        {/* Key Specifications */}
        {(product.movement || product.case_diameter || product.case_material) && (
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            {product.movement && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
                <span className="font-medium">Movimento:</span>
                <span className="text-foreground">{product.movement}</span>
              </div>
            )}
            {product.case_diameter && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
                <span className="font-medium">Diâmetro:</span>
                <span className="text-foreground">{product.case_diameter}</span>
              </div>
            )}
            {product.case_material && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
                <span className="font-medium">Material:</span>
                <span className="text-foreground">{product.case_material}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="pt-3 border-t border-border/30 space-y-1">
          {product.original_price && (
            <p className="text-sm text-muted-foreground line-through">
              {typeof product.original_price === 'string' ? product.original_price : String(product.original_price)}
            </p>
          )}
          <p className="text-price-large bg-gradient-primary bg-clip-text text-transparent">
            {priceDisplay}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay,
              image: mainImage
            }}
            variant="primary"
            size="sm"
            className="flex-1 gap-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-glow font-semibold rounded-lg"
            showText={true}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="px-3 transition-all duration-300 hover:bg-primary hover:text-primary-foreground rounded-lg liquid-glass"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className="text-xs font-medium">Ver</span>
          </Button>
        </div>
      </CardContent>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-0 bg-transparent border-none shadow-none">
          <img src={mainImage} alt={`Relógio ${product.brand} ${product.name}`} className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
