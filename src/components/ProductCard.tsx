
import React, { useState } from 'react';
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onClick, showBadgesAtBase = false }) => {
  const { addToCart } = useApp();
  const { notifyCartAction } = useNotifications();
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
    notifyCartAction('add', product.name);
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
    <Card className="group relative w-full max-w-sm mx-auto bg-background rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border border-border/50">
      {/* Área da Imagem - Layout elegante inspirado na referência */}
      <div className="relative aspect-[4/5] overflow-hidden">
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
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay elegante no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Badge ORIGINAL - Canto superior direito */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
            ORIGINAL
          </div>
        </div>

        {/* Badge de Oferta - Canto superior esquerdo */}
        {isOfferActive && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg">
              OFERTA
            </div>
          </div>
        )}

        {/* Coração de Favorito - Elegante e posicionado */}
        <div className="absolute top-4 right-16 z-10">
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="sm"
            className="bg-background/90 backdrop-blur-md hover:bg-background shadow-lg border border-border/30 rounded-xl w-10 h-10"
          />
        </div>

        {/* Ícone de Carrinho Flutuante - Posição elegante */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={handleQuickAddToCart}
            className="bg-primary text-primary-foreground hover:bg-primary/90 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 border border-primary/20"
            title="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área de Informações - Layout refinado */}
      <CardContent className="p-6 space-y-4">
        {/* Marca - Estilo sofisticado */}
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2">
          {product.brand}
        </p>

        {/* Nome do Produto - Tipografia elegante */}
        <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2 leading-snug min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Preços - Design clean */}
        <div className="space-y-2">
          {isOfferActive && originalDisplay && (
            <p className="text-base text-muted-foreground line-through font-medium">
              {originalDisplay}
            </p>
          )}
          
          <p className="text-2xl font-bold text-foreground">
            {priceDisplay || 'Consulte'}
          </p>
        </div>

        {/* Descrição breve - Tipografia clean */}
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description || `Relógio ${product.brand} original em excelente estado. Produto com garantia de autenticidade.`}
        </p>

        {/* Botão Ver Detalhes - Design refinado */}
        <div className="pt-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 text-base font-semibold border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 rounded-xl"
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
};
