import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductBadge } from "@/components/ProductBadge";
import { getDisplayBadges } from "@/utils/badgeUtils";
import { StockStatus } from "@/components/StockStatus";
import { useNavigate } from "react-router-dom";

import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onProductClick?: (id: string) => void;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const isOutOfStock = product.stock_status === 'out_of_stock';

  return (
    <Card className="group bg-card rounded-xl shadow-card overflow-hidden hover:shadow-elegant transition-all duration-500 animate-fade-in relative">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
        />
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold text-lg">
              ESGOTADO
            </div>
          </div>
        )}

        {/* Badges */}
        {(() => {
          const displayBadges = getDisplayBadges(product, 2);
          return displayBadges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {displayBadges.map((badge, index) => (
                <ProductBadge key={index} badge={badge} />
              ))}
            </div>
          );
        })()}
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton productId={product.id} productName={product.name} />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <p className="font-inter text-sm text-muted-foreground">
              {product.brand}
            </p>
            {product.stock_status && (
              <div className="ml-2">
                <StockStatus 
                  stockStatus={product.stock_status as any} 
                  stockQuantity={product.stock_quantity}
                />
              </div>
            )}
          </div>
          
          <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
            {product.name}
          </h3>
          
          <p className="font-inter text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Custom Tags */}
          {product.custom_tags && product.custom_tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {product.custom_tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <p className="font-playfair text-2xl font-bold text-primary flex items-baseline justify-center">
            <span className="text-lg mr-1">R$</span>
            <span>{product.price.replace('R$ ', '')}</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          {!isOutOfStock ? (
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              }}
              size="lg"
              className="w-full font-inter font-medium"
            />
          ) : (
            <Button 
              size="lg"
              className="w-full font-inter font-medium opacity-50 cursor-not-allowed"
              disabled
              variant="outline"
            >
              Produto Esgotado
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full font-inter font-medium"
            onClick={() => navigate(`/produto/${product.id}`)}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </Card>
  );
};