
import React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/contexts/AppContext";
import { useButtonStates } from "@/hooks/useButtonStates";
import { formatPrice } from "@/utils/priceUtils";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image: string;
  };
  variant?: "default" | "liquid-glass";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
}

export const AddToCartButton = React.memo(({ 
  product, 
  variant = "default",
  size = "default",
  className = "" 
}: AddToCartButtonProps) => {
  const { addToCart } = useApp();
  const { getButtonState, triggerButtonFeedback } = useButtonStates();
  
  const buttonId = `cart-${product.id}`;
  const isAdded = getButtonState(buttonId);

  const handleAddToCart = React.useCallback(() => {
    try {
      // Usar produto direto
      addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? product.price : formatPrice(product.price),
        image: product.image
      });
      
      triggerButtonFeedback(buttonId, 1500);
    } catch (error) {
      console.error('AddToCartButton - ERRO:', error);
    }
  }, [addToCart, product, triggerButtonFeedback, buttonId]);

  // Map variants and sizes to match shadcn/ui button
  const mappedVariant = variant === "liquid-glass" ? "outline" : "primary";
  const mappedSize = size === "default" ? "md" : size === "xl" ? "lg" : size;

  return (
    <Button
      variant={mappedVariant}
      size={mappedSize}
      onClick={handleAddToCart}
      className={`transition-all duration-300 ${isAdded ? "scale-95" : "hover:scale-105"} ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Adicionado
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Adicionar ao Carrinho
        </>
      )}
    </Button>
  );
});
