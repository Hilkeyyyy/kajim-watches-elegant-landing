
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
  const isOfferActive = product.original_price && parseFloat(product.original_price.toString()) > parseFloat(product.price.toString());

  return (
    <Card className="group relative w-full bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border border-border/20">
      {/* Imagem Principal - Chronos Elite Style */}
      <div className="relative aspect-[4/3] overflow-hidden">
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
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        </div>

        {/* Badge ORIGINAL - Canto superior direito */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
            ORIGINAL
          </div>
        </div>

        {/* Badge de Oferta - Canto superior esquerdo */}
        {isOfferActive && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              OFERTA - 10%
            </div>
          </div>
        )}

        {/* Coração de Favorito - Canto inferior direito */}
        <div className="absolute bottom-4 right-4 z-10">
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="sm"
            className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg border-0 rounded-full w-10 h-10"
          />
        </div>
      </div>

      {/* Área de Informações - Chronos Elite Style */}
      <div className="p-6 space-y-4">
        {/* Brand */}
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.1em]">
          {product.brand}
        </p>

        {/* Nome do Produto */}
        <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-snug min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Preços */}
        <div className="space-y-2">
          {/* Preço original riscado */}
          {isOfferActive && originalDisplay && (
            <p className="text-sm text-muted-foreground line-through">
              {originalDisplay}
            </p>
          )}
          
          {/* Preço atual */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-foreground">
              {priceDisplay || 'Consulte'}
            </p>
            {isOfferActive && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                7% DE DESCONTO
              </span>
            )}
          </div>
        </div>

        {/* Descrição breve */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {product.description || `Relógio ${product.brand} em excelente estado de conservação. Produto original com garantia.`}
        </p>
      </div>

      {/* Botões de Ação - Estilo Chronos Elite */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {/* Botão Adicionar ao Carrinho - Gradiente elegante */}
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay || 'Consulte',
              image: mainImage
            }}
            className="w-full h-12 bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            showText={true}
          />

          {/* Botões secundários */}
          <div className="flex gap-3">
            {/* Comprar via WhatsApp */}
            <Button
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={handleDirectPurchase}
            >
              Comprar via WhatsApp
            </Button>
            
            {/* Ver Detalhes */}
            <Button
              variant="outline"
              className="px-6 h-12 border-border hover:bg-accent hover:text-accent-foreground font-semibold text-sm rounded-xl transition-all duration-300"
              asChild
            >
              <Link to={`/produto/${product.id}`}>
                Ver Detalhes
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox para zoom da imagem */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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
