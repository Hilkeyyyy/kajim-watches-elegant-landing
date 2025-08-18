import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { AddToCartButtonAnimated } from '@/components/AddToCartButtonAnimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { StockStatus } from '@/components/StockStatus';
import { ProductBadge } from '@/components/ProductBadge';
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

  const mainImage = (product as any).image_url || product.image || (product.images && product.images[0]) || '/placeholder.svg';
  
  const priceDisplay = typeof product.price === 'string' 
    ? formatPrice(parseFloat(product.price))
    : formatPrice(product.price);
  const originalDisplay = product.original_price
    ? (typeof product.original_price === 'string' ? formatPrice(parseFloat(product.original_price)) : formatPrice(product.original_price))
    : null;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-card/80 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] rounded-xl w-full max-w-[400px] min-h-[620px] liquid-glass"
    >
      <Link to={`/produto/${product.id}`} className="block">
        <div className="relative">
          {/* Product Image */}
          <div
            className="h-80 overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 rounded-t-xl"
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.08]"
              loading="lazy"
            />
            
            {/* Badges no canto superior esquerdo */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {(product as any).badges?.slice(0, 2).map((badge: string, index: number) => (
                <ProductBadge key={index} badge={badge} size="sm" />
              ))}
            </div>
            
            {/* Botão de favorito no canto superior direito */}
            <div className="absolute top-3 right-3">
              <FavoriteButton 
                productId={product.id} 
                productName={product.name}
                size="sm"
                className="bg-white/90 hover:bg-white shadow-lg"
              />
            </div>
            
            {/* Status do estoque no canto inferior direito */}
            <div className="absolute bottom-3 right-3">
              <StockStatus 
                stockStatus={(product as any).stock_status} 
                quantity={(product as any).stock_quantity}
                size="sm"
              />
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-accent font-semibold uppercase tracking-wider opacity-80">
              {product.brand}
            </p>
          </div>
          
          {/* Product Name */}
          <h3 className="text-xl font-semibold text-foreground line-clamp-2 leading-snug min-h-[3rem] group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="pt-3 space-y-2">
            {product.original_price && (
              <p className="text-base text-muted-foreground line-through">
                {originalDisplay}
              </p>
            )}
            <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              {priceDisplay}
            </p>
          </div>
        </CardContent>
      </Link>
      
      {/* Action Buttons - Outside Link to prevent navigation conflicts */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay,
              image: mainImage
            }}
            variant="primary"
            size="md"
            className="flex-1 gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-semibold rounded-lg"
            showText={true}
          />
          
          <Button
            variant="outline"
            size="md"
            className="px-4 transition-all duration-300 hover:bg-primary hover:text-primary-foreground rounded-lg liquid-glass"
            asChild
          >
            <Link to={`/produto/${product.id}`}>
              <span className="text-sm font-medium">Ver Mais</span>
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <img src={mainImage} alt={`Relógio ${product.brand} ${product.name}`} className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>
    </Card>
  );
};