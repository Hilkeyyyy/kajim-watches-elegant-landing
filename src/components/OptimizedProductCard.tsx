import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
  showBadgesAtBase?: boolean;
}

/**
 * ProductCard otimizado com React.memo e lazy loading
 */
const OptimizedProductCard: React.FC<ProductCardProps> = memo(({ 
  product, 
  onProductClick, 
  onClick, 
  showBadgesAtBase = false 
}) => {
  const { addToCart } = useApp();
  const { notifyCartAction } = useNotifications();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    addToCart({
      id: product.id,
      name: product.name,
      price: priceDisplay || 'Consulte',
      image: mainImage
    });
    notifyCartAction('add', product.name);
  }, [addToCart, product.id, product.name, notifyCartAction]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Memoized calculations
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

  return (
    <Card className="group relative w-full max-w-full mx-auto bg-gradient-to-br from-background to-background/95 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2 overflow-hidden border border-border/30 backdrop-blur-sm">
      {/* Área da Imagem com lazy loading otimizado */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
          
          {/* Indicador de zoom sutil */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-white/20 backdrop-blur-lg rounded-full p-3 border border-white/30 shadow-xl">
              <div className="w-6 h-6 border-2 border-white rounded-full relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full rotate-45 transform translate-x-1 translate-y-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge de Oferta - Design sofisticado */}
        {isOfferActive && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-xl backdrop-blur-sm border border-red-400/30">
              OFERTA
            </div>
          </div>
        )}

        {/* Coração de Favorito - Premium Glass Effect */}
        <div className="absolute top-4 right-4 z-10">
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="md"
            className="bg-white/25 backdrop-blur-2xl hover:bg-white/40 shadow-2xl border border-white/40 rounded-2xl w-12 h-12 lg:w-14 lg:h-14 transition-all duration-500 hover:scale-110 hover:rotate-3"
          />
        </div>

        {/* Badge ORIGINAL - Design sofisticado */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-xl backdrop-blur-sm border border-foreground/20">
            ORIGINAL
          </div>
        </div>

        {/* Ícone de Carrinho Flutuante - Design premium */}
        <div className="absolute bottom-4 left-4 z-10">
          <button
            onClick={handleQuickAddToCart}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary p-3 rounded-2xl shadow-xl transition-all duration-500 hover:scale-110 hover:-rotate-3 border border-primary/30 backdrop-blur-sm"
            title="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de Informações - Layout sofisticado premium */}
      <CardContent className="p-4 lg:p-5 space-y-3 bg-gradient-to-t from-muted/10 to-transparent">
        {/* Marca - Design luxuoso */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-primary uppercase tracking-[0.15em] mb-1 bg-primary/10 px-3 py-1 rounded-full">
            {product.brand}
          </p>
          {isOfferActive && (
            <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
              OFERTA EXCLUSIVA
            </div>
          )}
        </div>

        {/* Nome do Produto - Tipografia premium */}
        <h3 className="font-serif text-lg lg:text-xl font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        {/* Preços - Design luxuoso */}
        <div className="space-y-1 py-1">
          {isOfferActive && originalDisplay && (
            <p className="text-lg text-muted-foreground line-through font-medium opacity-70">
              {originalDisplay}
            </p>
          )}
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl lg:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {priceDisplay || 'Consulte'}
            </p>
            {isOfferActive && (
              <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                ECONOMIA
              </span>
            )}
          </div>
        </div>

        {/* Descrição breve - Design sofisticado */}
        <p className="text-sm text-muted-foreground line-clamp-1 leading-tight font-medium">
          {product.description || `Relógio ${product.brand} original em excelente estado`}
        </p>

        {/* Botão Ver Detalhes - Design premium */}
        <div className="pt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-background to-muted/50 border-2 border-primary/30 hover:from-primary hover:to-primary/90 hover:text-primary-foreground hover:border-primary transition-all duration-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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