import React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptimizedCart } from "@/hooks/useOptimizedCart";
import { useButtonStates } from "@/hooks/useButtonStates";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: string;
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
  const { addToCart } = useOptimizedCart();
  const { getButtonState, triggerButtonFeedback } = useButtonStates();
  
  const buttonId = `cart-${product.id}`;
  const isAdded = getButtonState(buttonId);

  const handleAddToCart = React.useCallback(() => {
    addToCart(product);
    triggerButtonFeedback(buttonId, 1500);
  }, [addToCart, product, triggerButtonFeedback, buttonId]);

  return (
    <Button
      variant={variant}
      size={size}
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