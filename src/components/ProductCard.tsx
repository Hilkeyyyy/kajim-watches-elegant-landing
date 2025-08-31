
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { AddToCartButtonAnimated } from '@/components/AddToCartButtonAnimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { StockIndicator } from '@/components/StockIndicator';
import { ProductBadge } from '@/components/ProductBadge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
  showBadgesAtBase?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onClick, showBadgesAtBase = false }) => {
  const { toggleFavorite, isFavorite } = useApp();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else if (onClick) {
      onClick();
    }
  };

  const handleDirectPurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}/produto/${product.id}`;
    const priceText = typeof product.price === 'string' ? product.price : formatPrice(product.price as number);
    const message = `Olá! Tenho interesse no ${product.name} (${priceText}). Link: ${productUrl}`;
    const whatsappUrl = `https://wa.me/559181993435?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    <Card className="group cursor-pointer overflow-hidden border border-border/20 bg-gradient-to-br from-card/98 to-card/95 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] rounded-xl w-full h-full relative flex flex-col">
      <Link to={`/produto/${product.id}`} className="block flex-1 flex flex-col">{/* Link com path correto */}
        {/* Product Image - Full Bleed */}
        <div className="relative h-[260px] sm:h-[280px] -m-0">
          <div
            className="w-full h-full overflow-hidden rounded-t-xl relative"
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
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Badges condicionais (apenas em favoritos/carrinho) */}
            {showBadgesAtBase && (product as any).badges && (product as any).badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {(product as any).badges.slice(0, 2).map((badge: string, index: number) => (
                  <ProductBadge key={index} badge={badge} size="sm" />
                ))}
              </div>
            )}
            
            {/* Botão de favorito no canto superior direito */}
            <div className="absolute top-3 right-3">
              <FavoriteButton 
                productId={product.id} 
                productName={product.name}
                size="sm"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border border-white/20"
              />
            </div>
            
            {/* Status do estoque - liquid glass design */}
            <div className="absolute bottom-3 right-3">
              <StockIndicator 
                stockQuantity={stockQuantity}
                size="sm"
              />
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3 flex flex-col flex-1">
          {/* Brand e badges na base (quando for favoritos/carrinho) */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary/90 font-bold uppercase tracking-wider">
              {product.brand}
            </p>
            {/* Badge Original sempre presente */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 px-2 py-0.5 rounded-full">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Original</span>
            </div>
          </div>

          {/* Badges discretos na base (para favoritos/carrinho) */}
          {showBadgesAtBase && (product as any).badges && (product as any).badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {(product as any).badges.slice(0, 3).map((badge: string, index: number) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-accent/20 to-moss/20 text-primary border border-accent/30"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          
          {/* Product Name */}
          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Breve descrição */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {product.description || `Relógio ${product.brand} ${product.case_size ? `- ${product.case_size}` : ''} ${product.movement ? `- ${product.movement}` : ''}`}
            </p>
          </div>
          
          {/* Price Section */}
          <div className="pt-1 space-y-1 mt-auto">
            {product.original_price && (
              <p className="text-xs text-muted-foreground line-through opacity-70">
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
      
      {/* Action Buttons - sempre visíveis */}
      <div className="px-4 pb-4 mt-auto min-h-[56px] flex items-center">
        <div className="flex gap-1.5 w-full">
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay || 'Consulte',
              image: mainImage
            }}
            variant="primary"
            size="sm"
            className="flex-1 gap-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg font-bold rounded-lg bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white border-0 shadow-md text-xs py-2"
            showText={true}
          />

          <Button
            size="sm"
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 shadow-sm text-xs"
            onClick={handleDirectPurchase}
          >
            Comprar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="px-3 py-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:text-primary hover:border-primary/30 rounded-lg backdrop-blur-sm border-border/30 shadow-sm text-xs"
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
