
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

export const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const { count } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-xl">KAJIM</span>
          </Link>

          {/* Busca */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar relógios..."
                className="pl-9 pr-4"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center space-x-4">
            {/* Favoritos */}
            <Link to="/favoritos">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Button>
            </Link>

            {/* Carrinho */}
            <Link to="/carrinho">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* Menu do usuário */}
            {user ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="w-5 h-5 mr-1" />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
