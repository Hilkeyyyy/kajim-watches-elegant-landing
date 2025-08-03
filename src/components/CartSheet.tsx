
import React from "react";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSheet = React.memo(({ isOpen, onClose }: CartSheetProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount, loading } = useCart();

  const sendCartToWhatsApp = () => {
    if (items.length === 0) return;

    const currentDate = new Date().toLocaleString('pt-BR');
    let message = 'Olá, gostaria de saber mais sobre estes produtos:\n\n';

    items.forEach((item, index) => {
      const itemTotal = (item.price * item.quantity).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      });
      
      message += `${index + 1}. ${item.name}\n`;
      message += `Quantidade: ${item.quantity}\n`;
      message += `Preço: ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
      message += `Total: ${itemTotal}\n\n`;
    });

    const total = getTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    message += `Total do pedido: ${total}\n`;
    message += `Data/Hora do pedido: ${currentDate}`;

    const whatsappUrl = `https://wa.me/5586988388124?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
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
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-4 rounded-lg border space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Preço unitário: {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total do item:</span>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
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
                  {getTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? 'item' : 'itens'} no total
              </p>
            </div>
            
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full"
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
