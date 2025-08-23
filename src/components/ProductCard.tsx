
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

  const stockQuantity = (product as any).stock_quantity || 0;
  const isLimitedStock = stockQuantity > 0 && stockQuantity <= 5;

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl w-full h-full relative flex flex-col min-h-[400px]">
      <Link to={`/produto/${product.id}`} className="block flex-1 flex flex-col">{/* Link com path correto */}
        {/* Product Image */}
        <div className="relative aspect-square">
          <div
            className="w-full h-full overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5 rounded-t-2xl relative"
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.08] filter group-hover:brightness-110"
              loading="lazy"
            />
            
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            
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
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border border-white/20"
              />
            </div>
            
            {/* Status do estoque - mais destacado */}
            <div className="absolute bottom-3 right-3">
              {isLimitedStock && (
                <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg border border-amber-400/30">
                  <span className="flex items-center gap-1">
                    ⚡ Últimas {stockQuantity}
                  </span>
                </div>
              )}
              {stockQuantity > 5 && (
                <div className="bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg border border-emerald-400/30">
                  ✓ Estoque ({stockQuantity})
                </div>
              )}
              {stockQuantity === 0 && (
                <div className="bg-gradient-to-r from-red-500/90 to-rose-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg border border-red-400/30">
                  ✗ Indisponível
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-2 flex flex-col flex-1">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary/80 font-bold uppercase tracking-wider">
              {product.brand}
            </p>
          </div>
          
          {/* Product Name */}
          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Description - always show something */}
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed font-light flex-1">
            {product.description || 
             `Relógio ${product.brand}${product.model ? ` ${product.model}` : ''}${product.case_size ? ` - ${product.case_size}` : ''}${product.movement ? ` - ${product.movement}` : ''}.`}
          </p>
          
          {/* Price Section */}
          <div className="pt-1 space-y-1 mt-auto">
            {product.original_price && (
              <p className="text-sm text-muted-foreground line-through opacity-70">
                {originalDisplay}
              </p>
            )}
            <div className="flex items-center gap-2">
              <p className="text-base font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight tracking-tight">
                {priceDisplay || 'Consulte'}
              </p>
              {product.original_price && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                  OFERTA
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      
      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay || 'Consulte',
              image: mainImage
            }}
            variant="primary"
            size="sm"
            className="flex-1 gap-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white border-0 shadow-md text-xs"
            showText={true}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="px-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary hover:border-primary/30 rounded-xl backdrop-blur-sm border-border/30 shadow-sm text-xs"
            asChild
          >
            <Link to={`/produto/${product.id}`}>
              <span className="font-semibold">Ver</span>
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={mainImage} 
              alt={`Relógio ${product.brand} ${product.name}`} 
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
