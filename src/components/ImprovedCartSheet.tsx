import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const ImprovedCartSheet = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getTotalItems } = useApp();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative gap-2 hover:bg-muted/50 transition-all duration-200"
        >
          <ShoppingCart className="w-5 h-5" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-accent border-0 animate-pulse"
            >
              {getTotalItems()}
            </Badge>
          )}
          <span className="hidden sm:inline font-medium">Carrinho</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            Carrinho de Compras
          </SheetTitle>
          
          {cart.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{cart.length} {cart.length === 1 ? 'item' : 'itens'}</span>
              <span className="font-medium text-foreground">{getCartTotal()}</span>
            </div>
          )}
        </SheetHeader>

        <Separator className="my-4" />

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Carrinho vazio</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione produtos incríveis à sua coleção
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to="/">Explorar Relógios</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-muted/10 rounded-xl border border-border/50">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-muted/20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-primary">
                      {item.price}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-7 h-7 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Footer Actions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getCartTotal()}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary">
                  <Link to="/carrinho">Ver Carrinho Completo</Link>
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Frete grátis para todo o Brasil
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};