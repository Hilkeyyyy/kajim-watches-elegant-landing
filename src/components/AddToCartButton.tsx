import React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
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
  const { addToCart } = useCart();
  const { getButtonState, triggerButtonFeedback } = useButtonStates();
  
  const buttonId = `cart-${product.id}`;
  const isAdded = getButtonState(buttonId);

  const handleAddToCart = React.useCallback(() => {
    console.log('AddToCartButton - INICIANDO add to cart:', { 
      productId: product.id, 
      productName: product.name,
      buttonId 
    });
    try {
      console.log('AddToCartButton - Chamando addToCart...');
      addToCart(product);
      console.log('AddToCartButton - addToCart chamado, triggerando feedback...');
      triggerButtonFeedback(buttonId, 1500);
      console.log('AddToCartButton - SUCESSO completo');
    } catch (error) {
      console.error('AddToCartButton - ERRO:', error);
    }
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