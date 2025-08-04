
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
      className="group cursor-pointer overflow-hidden border-0 bg-card shadow-elegant hover:shadow-card transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-[4/3] sm:aspect-square overflow-hidden bg-muted/20">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badges Overlay */}
          {product.badges && product.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {product.badges.slice(0, 2).map((badge, index) => (
                <Badge 
                  key={index}
                  variant={badge === 'OFERTA' ? 'destructive' : badge === 'NOVO' ? 'default' : 'secondary'}
                  className="text-xs font-medium px-2 py-1 shadow-sm"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Featured Star */}
          {product.is_featured && (
            <div className="absolute top-3 right-12">
              <Star className="w-4 h-4 text-accent fill-accent" />
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-background hover:scale-110 transition-all duration-300 ${
            isFavorite(product.id) ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite(product.id) ? "fill-current scale-110" : ""
            }`} 
          />
        </Button>
      </div>

      <CardContent className="p-4 sm:p-5 space-y-3">
        {/* Brand */}
        <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
          {product.brand}
        </p>
        
        {/* Product Name */}
        <h3 className="font-playfair text-base sm:text-lg font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>
        
        {/* Key Specifications */}
        {(product.movement || product.case_diameter || product.case_material) && (
          <div className="text-xs text-muted-foreground space-y-1">
            {product.movement && (
              <p className="flex items-center gap-1">
                <span className="w-1 h-1 bg-accent rounded-full"></span>
                {product.movement}
              </p>
            )}
            {product.case_diameter && (
              <p className="flex items-center gap-1">
                <span className="w-1 h-1 bg-accent rounded-full"></span>
                {product.case_diameter}
              </p>
            )}
            {product.case_material && (
              <p className="flex items-center gap-1">
                <span className="w-1 h-1 bg-accent rounded-full"></span>
                {product.case_material}
              </p>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="pt-2">
          <p className="font-playfair text-xl sm:text-2xl font-bold text-foreground">
            {priceDisplay}
          </p>
        </div>
        
        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="sm"
          className="w-full gap-2 transition-all duration-300 hover:scale-[1.02] font-medium"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Adicionar ao Carrinho
        </Button>
      </CardContent>
    </Card>
  );
};
