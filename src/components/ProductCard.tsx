
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onClick }) => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Usar o produto direto
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? product.price : formatPrice(product.price),
      image: product.image || product.images?.[0] || ''
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id, product.name);
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else if (onClick) {
      onClick();
    }
  };

  const mainImage = product.image || product.images[0] || '';
  
  // Garantir que o preço seja tratado corretamente
  const priceDisplay = typeof product.price === 'string' 
    ? product.price 
    : formatPrice(product.price);

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-card/50 backdrop-blur-sm shadow-luxury hover:shadow-glow transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 rounded-xl"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-xl">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.15] group-hover:rotate-1"
            loading="lazy"
          />
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badges Overlay */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {product.badges.slice(0, 2).map((badge, index) => (
                <Badge 
                  key={index}
                  variant={badge === 'OFERTA' ? 'destructive' : badge === 'NOVO' ? 'default' : 'secondary'}
                  className="text-xs font-semibold px-2.5 py-1 shadow-md backdrop-blur-sm border-0 rounded-full"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Featured Star */}
          {product.is_featured && (
            <div className="absolute top-3 right-14 bg-gradient-primary p-1.5 rounded-full shadow-glow">
              <Star className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-background/95 backdrop-blur-md border border-border/30 hover:bg-background hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-sm ${
            isFavorite(product.id) 
              ? "text-red-500 hover:text-red-600 bg-red-50/90 border-red-200/50" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-500 ${
              isFavorite(product.id) ? "fill-current scale-110 animate-pulse" : ""
            }`} 
          />
        </Button>
      </div>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-accent font-semibold uppercase tracking-[0.1em] opacity-80">
            {product.brand}
          </p>
          {product.is_featured && (
            <div className="flex items-center gap-1 text-xs text-accent font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Destaque</span>
            </div>
          )}
        </div>
        
        {/* Product Name */}
        <h3 className="font-playfair text-lg sm:text-xl font-bold text-foreground line-clamp-2 leading-snug min-h-[2.8rem] sm:min-h-[3.2rem] group-hover:text-primary transition-colors duration-300">
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
        <div className="pt-3 border-t border-border/30">
          <p className="font-playfair text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {priceDisplay}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 gap-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-glow font-semibold rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
            <span className="sm:hidden">Add</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="px-3 transition-all duration-300 hover:bg-primary hover:text-primary-foreground rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className="text-xs font-medium">Ver</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
