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

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSheet = ({ isOpen, onClose }: CartSheetProps) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, sendCartToWhatsApp } = useCart();

  if (cartItems.length === 0) {
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
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-auto py-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-card p-4 rounded-lg border"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.price}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Actions */}
          <div className="border-t pt-6 space-y-3">
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
};