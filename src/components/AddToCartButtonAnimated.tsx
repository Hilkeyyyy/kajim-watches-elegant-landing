import React, { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface AddToCartButtonAnimatedProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    image?: string;
    brand?: string;
  };
  variant?: "outline" | "ghost" | "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export const AddToCartButtonAnimated = React.memo(({ 
  product, 
  variant = "primary", 
  size = "md", 
  className,
  showText = true
}: AddToCartButtonAnimatedProps) => {
  const { addToCart } = useApp();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSuccess || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: typeof product.price === 'string' ? product.price : product.price.toString(),
        image: product.image || '',
        brand: product.brand
      });
      
      // Trigger success animation
      setIsSuccess(true);
      
      // Reset after animation
      setTimeout(() => {
        setIsSuccess(false);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isSuccess ? "primary" : variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading}
      className={cn(
        "button-success transition-all duration-300 relative overflow-hidden",
        isSuccess && "animate-success bg-green-500 hover:bg-green-600 border-green-500",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isSuccess ? (
          <>
            <Check className="w-4 h-4 checkmark" />
            {showText && <span>Adicionado!</span>}
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            {showText && <span>Adicionar</span>}
          </>
        )}
      </div>
      
      {/* Success overlay effect */}
      {isSuccess && (
        <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse" />
      )}
    </Button>
  );
});

AddToCartButtonAnimated.displayName = "AddToCartButtonAnimated";