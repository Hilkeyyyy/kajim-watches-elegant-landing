import { useApp } from '@/contexts/AppContext';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

export const CartDebugger = () => {
  const appContext = useApp();
  const cartHook = useCart();

  const testProduct = {
    id: 'test-product',
    name: 'Produto Teste',
    price: 'R$ 100,00',
    image: '/placeholder.svg'
  };

  const handleTestAdd = () => {
    console.log('=== TESTE CARRINHO ===');
    console.log('Estado AppContext antes:', {
      cartLength: appContext.cart.length,
      totalItems: appContext.getTotalItems(),
      isLoading: appContext.isLoading
    });
    console.log('Estado useCart antes:', {
      cartLength: cartHook.cartItems.length,
      totalItems: cartHook.getTotalItems(),
      isLoading: cartHook.isLoading
    });
    
    appContext.addToCart(testProduct);
    
    setTimeout(() => {
      console.log('Estado AppContext depois:', {
        cartLength: appContext.cart.length,
        totalItems: appContext.getTotalItems(),
        isLoading: appContext.isLoading
      });
      console.log('Estado useCart depois:', {
        cartLength: cartHook.cartItems.length,
        totalItems: cartHook.getTotalItems(),
        isLoading: cartHook.isLoading
      });
    }, 100);
  };

  return (
    <div className="fixed top-4 right-4 bg-background border p-4 rounded-lg z-50">
      <h3 className="font-bold mb-2">Debug Carrinho</h3>
      <p>AppContext: {appContext.cart.length} itens ({appContext.getTotalItems()})</p>
      <p>useCart: {cartHook.cartItems.length} itens ({cartHook.getTotalItems()})</p>
      <p>Loading: {appContext.isLoading ? 'Sim' : 'Não'}</p>
      <Button onClick={handleTestAdd} className="mt-2">
        Testar Adicionar
      </Button>
      <Button onClick={() => appContext.clearCart()} className="mt-2 ml-2" variant="outline">
        Limpar
      </Button>
    </div>
  );
};