import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ShoppingCart, Check } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
  showBadgesAtBase?: boolean;
  badgeStyle?: 'default' | 'hero';
}

/**
 * ProductCard otimizado com React.memo e lazy loading
 */
const OptimizedProductCard: React.FC<ProductCardProps> = memo(({ 
  product, 
  onProductClick, 
  onClick, 
  showBadgesAtBase = false,
  badgeStyle = 'default',
}) => {
  const { addToCart } = useApp();
  const { notifyCartAction } = useNotifications();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Memoized calculations (placed before handlers to satisfy TS)
  const mainImage = React.useMemo(() => 
    (product as any).image_url || product.image || 
    (product.images && product.images[0]) || '/placeholder.svg'
  , [product]);
  
  const priceDisplay = React.useMemo(() => 
    typeof product.price === 'string' 
      ? formatPrice(parseFloat(product.price))
      : formatPrice(product.price)
  , [product.price]);

  const originalDisplay = React.useMemo(() => 
    product.original_price
      ? (typeof product.original_price === 'string' 
          ? formatPrice(parseFloat(product.original_price)) 
          : formatPrice(product.original_price))
      : null
  , [product.original_price]);

  const isOfferActive = React.useMemo(() => 
    product.original_price && 
    parseFloat(product.original_price.toString()) > parseFloat(product.price.toString())
  , [product.original_price, product.price]);

  const isOutOfStock = React.useMemo(() => 
    (product as any).stock_quantity === 0
  , [(product as any).stock_quantity]);

  // Memoized handlers
  const handleClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(product.id);
    } else if (onClick) {
      onClick();
    }
  }, [onProductClick, onClick, product.id]);

  const handleQuickAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: priceDisplay || 'Consulte',
      image: mainImage
    });
    notifyCartAction('add', product.name);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
  }, [addToCart, product.id, product.name, notifyCartAction, isOutOfStock, priceDisplay, mainImage]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);


  return (
    <Card className="group relative w-full mx-auto bg-gradient-to-br from-background to-background/95 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden border border-border/20 touch-pan-y"
          style={{
            touchAction: 'pan-y',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}>
      {/* Área da Imagem com lazy loading otimizado - proporção quadrada */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/20 to-muted/5">
        <div
          className="w-full h-full cursor-pointer group/image"
          onClick={handleImageClick}
        >
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse" />
          )}
          
          <img
            src={mainImage}
            alt={`${product.brand} ${product.name}`}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            decoding="async"
          />
          
          {/* Overlay elegante multicamadas */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
          
          {/* Indicador de zoom sutil */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <div className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30 shadow-xl">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full rotate-45 transform translate-x-1 translate-y-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge de Oferta - Design padronizado */}
        {isOfferActive && (
          <div className="absolute top-2 left-2 z-10">
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm">
              OFERTA
            </div>
          </div>
        )}

        {/* Coração de Favorito - compacto */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="sm"
            className="bg-white/25 backdrop-blur-lg hover:bg-white/40 shadow-lg border border-white/30 rounded-xl w-8 h-8 transition-all duration-300 hover:scale-105"
          />
        </div>

        {/* Badge Status - Design compacto */}
        <div className="absolute bottom-2 right-2 z-10">
          {isOutOfStock ? (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-stone-600/90 to-stone-500/90 text-white border-stone-300/40 shadow-lg backdrop-blur-sm">
              ESGOTADO
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white border-emerald-300/40 shadow-lg backdrop-blur-sm">
              ORIGINAL
            </div>
          )}
        </div>

        {/* Ícone de Carrinho Flutuante - Design compacto */}
        <div className="absolute bottom-2 left-2 z-10">
          <button
            onClick={handleQuickAddToCart}
            disabled={isOutOfStock}
            className={`btn-fluid ${justAdded ? 'cart-feedback' : ''} bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-2 rounded-xl shadow-lg border border-primary/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
              isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isOutOfStock ? 'Produto esgotado' : 'Adicionar ao carrinho'}
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Área de Informações - Layout compacto */}
      <CardContent className="p-3 space-y-2 bg-gradient-to-t from-muted/10 to-transparent">
        {/* Marca e Oferta Exclusiva */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-md bg-foreground/5 text-foreground/80 truncate">
            <span className="notranslate" translate="no">{product.brand}</span>
          </div>
          {isOfferActive && (
             <div className="text-xs font-medium px-2 py-1 rounded-md bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white border-blue-300/40 shadow-lg backdrop-blur-sm whitespace-nowrap">
               OFERTA EXCLUSIVA
             </div>
          )}
        </div>

        {/* Nome do Produto - Compacto */}
        <h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2 min-h-[2rem] group-hover:text-primary transition-colors duration-300">
          <span className="notranslate" translate="no">{product.name}</span>
        </h3>

        {/* Preços - Design compacto */}
        <div className="space-y-1">
          {isOfferActive && originalDisplay && (
            <p className="text-sm text-muted-foreground line-through font-medium opacity-70">
              {originalDisplay}
            </p>
          )}
          
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {priceDisplay || 'Consulte'}
            </p>
          </div>
        </div>

        {/* Botão Ver Detalhes - Design compacto */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs font-medium bg-gradient-to-r from-background to-muted/50 border border-primary/30 hover:from-primary hover:to-primary/90 hover:text-primary-foreground hover:border-primary transition-all duration-300 rounded-lg"
            asChild
          >
            <Link to={`/produto/${product.id}`}>
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* Modal para visualização da imagem completa */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-background">
            <img 
              src={mainImage} 
              alt={`${product.brand} ${product.name}`} 
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export { OptimizedProductCard as ProductCard };