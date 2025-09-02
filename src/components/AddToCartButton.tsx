
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
    brand?: string;
  };
  variant?: "default" | "liquid-glass";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton = React.memo(({ 
  product, 
  variant = "default",
  size = "default",
  className = "",
  disabled = false
}: AddToCartButtonProps) => {
  const { addToCart } = useApp();
  const { getButtonState, triggerButtonFeedback } = useButtonStates();
  
  const buttonId = `cart-${product.id}`;
  const isAdded = getButtonState(buttonId);

  const handleAddToCart = React.useCallback(() => {
    if (disabled) return;
    try {
      // Usar produto direto
      addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? product.price : formatPrice(product.price),
        image: product.image,
        brand: product.brand
      });
      
      triggerButtonFeedback(buttonId, 1500);
    } catch (error) {
      console.error('AddToCartButton - ERRO:', error);
    }
  }, [addToCart, product, triggerButtonFeedback, buttonId, disabled]);

  // Map variants and sizes to match shadcn/ui button
  const mappedVariant = variant === "liquid-glass" ? "outline" : "primary";
  const mappedSize = size === "default" ? "md" : size === "xl" ? "lg" : size;

  return (
    <Button
      variant={mappedVariant}
      size={mappedSize}
      onClick={handleAddToCart}
      disabled={disabled}
      className={`transition-all duration-300 ${isAdded ? "scale-95" : "hover:scale-105"} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {disabled ? (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Produto Esgotado
        </>
      ) : isAdded ? (
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
