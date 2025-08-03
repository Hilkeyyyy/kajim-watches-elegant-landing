
import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const mainImage = product.image_url || product.images[0] || '';

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg" onClick={onClick}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={handleToggleFavorite}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h3 className="font-medium text-foreground line-clamp-2">{product.name}</h3>
          </div>

          <div className="space-y-1">
            {product.movement && (
              <p className="text-xs text-muted-foreground">Movimento: {product.movement}</p>
            )}
            {product.case_diameter && (
              <p className="text-xs text-muted-foreground">Diâmetro: {product.case_diameter}</p>
            )}
            {product.case_material && (
              <p className="text-xs text-muted-foreground">Material: {product.case_material}</p>
            )}
            {product.water_resistance && (
              <p className="text-xs text-muted-foreground">Resistência: {product.water_resistance}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg font-bold text-primary">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
