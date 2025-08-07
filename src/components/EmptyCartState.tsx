import React from 'react';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const EmptyCartState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Icon */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-muted/30 to-muted/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
          <span className="text-xs text-muted-foreground">0</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto mb-8">
        <h2 className="text-display mb-4 gradient-text">
          Seu carrinho está vazio
        </h2>
        <p className="text-subtitle text-muted-foreground mb-6">
          Descubra nossa coleção de relógios premium e adicione seus favoritos ao carrinho.
        </p>
        
        {/* Tip */}
        <div className="flex items-center gap-2 text-sm text-accent bg-accent/10 rounded-lg p-3 mb-6">
          <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs">💡</span>
          </div>
          <p>Dica: Encontre o relógio perfeito para seu estilo</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Button
          onClick={() => navigate('/')}
          className="flex-1 gap-2 bg-gradient-primary hover:opacity-90 text-white liquid-glass"
          size="lg"
        >
          <Search className="w-4 h-4" />
          Explorar Relógios
        </Button>
        
        <Button
          onClick={() => navigate('/favoritos')}
          variant="outline"
          className="flex-1 gap-2 liquid-glass hover-lift"
          size="lg"
        >
          <Heart className="w-4 h-4" />
          Ver Favoritos
        </Button>
      </div>

      {/* Featured sections */}
      <div className="mt-12 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold mb-2">Produtos em Destaque</h3>
            <p className="text-sm text-muted-foreground">
              Descubra nossa seleção especial de relógios premium
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏷️</span>
            </div>
            <h3 className="font-semibold mb-2">Ofertas Especiais</h3>
            <p className="text-sm text-muted-foreground">
              Encontre as melhores ofertas em relógios de luxo
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50">
            <div className="w-12 h-12 mx-auto mb-4 bg-moss/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
            <h3 className="font-semibold mb-2">Novidades</h3>
            <p className="text-sm text-muted-foreground">
              Veja os últimos lançamentos das melhores marcas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};