import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    details: {
      brand: string;
    };
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group bg-card rounded-xl shadow-card overflow-hidden hover:shadow-elegant transition-all duration-500 animate-fade-in">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={product.id} productName={product.name} />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <div className="text-center mb-4">
          <p className="font-inter text-sm text-muted-foreground mb-1">
            {product.details.brand}
          </p>
          <h3 className="font-playfair text-xl font-semibold text-primary mb-2">
            {product.name}
          </h3>
          <p className="font-inter text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <p className="font-playfair text-2xl font-bold text-primary flex items-baseline justify-center">
            <span className="text-lg mr-1">R$</span>
            <span>{product.price.replace('R$ ', '')}</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
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