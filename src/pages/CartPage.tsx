
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useCart } from '@/hooks/useCart';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">
              Adicione produtos ao carrinho para continuar sua compra.
            </p>
            <Button asChild>
              <Link to="/">Continuar Comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" onClick={clearCart}>
            Limpar Carrinho
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>
            
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary mb-4">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="px-3 py-1 bg-muted rounded-md min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.product_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {getTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">
                        R$ {getTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  
                  <Button size="lg" className="w-full">
                    Finalizar Compra
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/">Continuar Comprando</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
