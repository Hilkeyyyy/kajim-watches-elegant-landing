
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
    // Card Container - Layout estilo Chronos Elite
    <Card className="group relative w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden border border-gray-100">
      {/* Imagem Principal - 65% do card */}
      <div className="relative aspect-square overflow-hidden">
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
          
          {/* Overlay gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
        </div>

        {/* Badge ORIGINAL - Canto superior direito */}
        <div className="absolute top-3 right-3">
          <div className="bg-black text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            ORIGINAL
          </div>
        </div>

        {/* Badge de Oferta - Canto superior esquerdo (se houver) */}
        {isOfferActive && (
          <div className="absolute top-3 left-3">
            <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold uppercase">
              OFERTA
            </div>
          </div>
        )}

        {/* Coração de Favorito - Canto inferior direito */}
        <div className="absolute bottom-3 right-3">
          <FavoriteButton 
            productId={product.id} 
            productName={product.name}
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
          />
        </div>
      </div>

      {/* Área de Informações - 35% do card */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">
          {product.brand}
        </p>

        {/* Nome do Produto */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Preços */}
        <div className="space-y-1">
          {/* Preço original riscado */}
          {isOfferActive && (
            <p className="text-sm text-gray-400 line-through">
              {originalDisplay}
            </p>
          )}
          
          {/* Preço atual + badge de oferta inline */}
          <div className="flex items-center gap-2">
            <p className="text-lg font-black text-gray-900">
              {priceDisplay || 'Consulte'}
            </p>
            {isOfferActive && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                -15%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação - Altura Fixa 48px */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 h-12">
          {/* Adicionar ao Carrinho - Flex 1 */}
          <AddToCartButtonAnimated
            product={{
              id: product.id,
              name: product.name,
              price: priceDisplay || 'Consulte',
              image: mainImage
            }}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-all duration-300"
            showText={true}
          />

          {/* Comprar - Verde */}
          <Button
            className="px-4 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg transition-all duration-300"
            onClick={handleDirectPurchase}
          >
            Comprar
          </Button>
          
          {/* Ver - Outline */}
          <Button
            variant="outline"
            className="px-4 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm rounded-lg transition-all duration-300"
            asChild
          >
            <Link to={`/produto/${product.id}`}>
              Ver
            </Link>
          </Button>
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
