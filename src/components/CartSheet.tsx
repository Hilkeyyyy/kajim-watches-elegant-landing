import React from "react";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useApp } from "@/contexts/AppContext";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSheet = React.memo(({ isOpen, onClose }: CartSheetProps) => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getTotalItems, sendCartToWhatsApp, isLoading } = useApp();

  if (cart.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Carrinho de Compras</SheetTitle>
            <SheetDescription>
              Seus produtos selecionados aparecerão aqui
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Seu carrinho está vazio</p>
              <p className="text-sm">Adicione produtos para começar</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrinho de Compras</SheetTitle>
          <SheetDescription>
            {cart.length} {cart.length === 1 ? 'item' : 'itens'} no carrinho
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-card/98 to-card/95 p-3 rounded-xl border border-border/20 shadow-lg backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-sm text-foreground line-clamp-1">{item.name}</h4>
                          
                          {/* Badges do produto */}
                          {(item as any).badges && (item as any).badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {(item as any).badges.slice(0, 2).map((badge: string, index: number) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            Unit.: {item.price}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-2 h-2" />
                          </Button>
                          
                          <span className="text-xs font-bold w-6 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-2 h-2" />
                          </Button>
                        </div>
                        
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 px-2 py-0.5 rounded-full">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Original</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border-t pt-6 space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total do Carrinho:</span>
                <span className="text-lg font-bold text-primary">
                  {getCartTotal()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'} no total
              </p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={sendCartToWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar lista para WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={clearCart}
            >
              Limpar carrinho
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

CartSheet.displayName = "CartSheet";