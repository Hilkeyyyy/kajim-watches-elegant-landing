
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { parsePrice, formatPrice } from '@/utils/priceUtils';
import { AddToCartButtonAnimated } from '@/components/AddToCartButtonAnimated';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
  onClick?: () => void;
  showBadgesAtBase?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onClick, showBadgesAtBase = false }) => {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else if (onClick) {
      onClick();
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: priceDisplay || 'Consulte',
      image: mainImage
    });
  };

  const mainImage = (product as any).image_url || product.image || (product.images && product.images[0]) || '/placeholder.svg';
  
  const priceDisplay = typeof product.price === 'string' 
    ? formatPrice(parseFloat(product.price))
    : formatPrice(product.price);
  const originalDisplay = product.original_price
    ? (typeof product.original_price === 'string' ? formatPrice(parseFloat(product.original_price)) : formatPrice(product.original_price))
    : null;

  const isOfferActive = product.original_price && parseFloat(product.original_price.toString()) > parseFloat(product.price.toString());

  return (
    <Card className="group relative w-full bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden border border-border/30">
      {/* Área da Imagem - 70% da altura do card */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <div
          className="w-full h-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
        >
          <img
            src={mainImage}
            alt={`${product.brand} ${product.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Badge ORIGINAL - Canto superior direito - Tema KAJIM */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide shadow-sm">
            ORIGINAL
          </div>
        </div>

        {/* Badge de Oferta - Canto superior esquerdo - Tema KAJIM */}
        {isOfferActive && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide shadow-sm">
              OFERTA
            </div>
          </div>
        )}

        {/* Coração de Favorito - Canto superior (ajustado quando há ofertas) */}
        <div className={`absolute top-3 z-10 ${isOfferActive ? 'right-20' : 'right-12'}`}>
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="sm"
            className="bg-background/95 backdrop-blur-sm hover:bg-background shadow-sm border border-border/20 rounded-lg w-8 h-8"
          />
        </div>

        {/* Ícone de Carrinho Flutuante - Tema KAJIM */}
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={handleQuickAddToCart}
            className="bg-accent text-accent-foreground hover:bg-accent/90 p-2.5 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 border border-border/20"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Área de Informações - 30% da altura - Tema KAJIM */}
      <CardContent className="p-4 space-y-3">
        {/* Marca - Estilo KAJIM */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {product.brand}
        </p>

        {/* Nome do Produto - Tema KAJIM */}
        <h3 className="font-playfair text-base font-semibold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Preços - Tema KAJIM */}
        <div className="space-y-1">
          {/* Preço original riscado */}
          {isOfferActive && originalDisplay && (
            <p className="text-sm text-muted-foreground line-through">
              {originalDisplay}
            </p>
          )}
          
          {/* Preço atual */}
          <p className="text-lg font-bold text-foreground">
            {priceDisplay || 'Consulte'}
          </p>
        </div>

        {/* Descrição breve - Tema KAJIM */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {product.description || `Relógio ${product.brand} em excelente estado de conservação. Produto original com garantia.`}
        </p>

        {/* Botão Ver Detalhes - Discreto e elegante - Tema KAJIM */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-sm font-medium border-border hover:bg-accent hover:text-accent-foreground transition-colors"
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
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-background">
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
};
