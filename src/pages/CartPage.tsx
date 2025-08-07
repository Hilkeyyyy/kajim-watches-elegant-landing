import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { formatPrice } from '@/utils/priceUtils';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useApp();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSendToWhatsApp = () => {
    const message = cart
      .map(
        (item) =>
          `${item.name} - Qtd: ${item.quantity} - ${item.price}`
      )
      .join('\n');
    
    const total = getCartTotal();
    const fullMessage = `🛒 *Pedido KAJIM Watches*\n\n${message}\n\n💰 *Total: ${total}*\n\nGostaria de finalizar esta compra!`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="relative">
                <ShoppingCart className="w-20 h-20 text-muted-foreground/40 mx-auto" />
                <ShoppingBag className="w-6 h-6 text-accent absolute -top-2 -right-2" />
              </div>
              <div className="space-y-3">
                <h1 className="text-display gradient-text">
                  Seu carrinho está vazio
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Descubra nossa coleção de relógios premium e adicione seus favoritos ao carrinho.
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/">
                  <Button className="w-full sm:w-auto liquid-glass bg-gradient-primary hover:opacity-90">
                    Explorar Relógios
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  💡 Dica: Encontre o relógio perfeito para seu estilo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="space-y-6 sm:space-y-8">
          {/* Breadcrumb and Navigation */}
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Continuar Comprando</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
            </Link>
            {cart.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCart}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Limpar Carrinho</span>
                <span className="sm:hidden">Limpar</span>
              </Button>
            )}
          </div>

          {/* Page Title and Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-accent/20 to-moss/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Carrinho de Compras
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {cart.length} {cart.length === 1 ? 'item no carrinho' : 'itens no carrinho'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-48 sm:h-24 bg-muted/20 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-playfair text-lg font-semibold text-foreground line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-base font-bold text-foreground">
                          {item.price}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Subtotal</p>
                        <p className="font-playfair text-lg font-bold text-foreground">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-playfair text-xl">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium text-accent">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="font-playfair">{getCartTotal()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendToWhatsApp}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Finalizar via WhatsApp
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Você será redirecionado para o WhatsApp para finalizar seu pedido
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};