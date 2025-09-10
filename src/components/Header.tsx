
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { getTotalItems, favorites } = useApp();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getTotalItems();
  const favoritesCount = favorites.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/98 backdrop-blur-md supports-[backdrop-filter]:bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-playfair font-bold text-sm">K</span>
            </div>
            <span className="font-playfair font-bold text-xl text-foreground">KAJIM</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              {/* Search Bar - Desktop */}
              <div className="flex-1 max-w-md mx-8">
                <AdvancedSearchBar 
                  placeholder="Buscar relógios premium..."
                />
              </div>

              {/* Desktop Actions */}
              <div className="flex items-center space-x-2">
                {/* Favorites */}
                <Link to="/favoritos">
                  <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 transition-colors">
                    <Heart className="w-5 h-5" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {favoritesCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Cart */}
                <Link to="/carrinho">
                  <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                          Administrador
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => signOut()} className="hover:bg-muted/50">
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                      <User className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Mobile Actions */}
          {isMobile && (
            <div className="flex items-center space-x-2">

              {/* Mobile Favorites */}
              <Link to="/favoritos">
                <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Cart */}
              <Link to="/carrinho">
                <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-muted/50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="border-t border-border/50 bg-background/98 backdrop-blur-md">
            <div className="py-4 space-y-3">
              {/* Mobile Search */}
              <div className="px-4">
                <AdvancedSearchBar 
                  placeholder="Buscar relógios..."
                  onResultClick={() => setMobileMenuOpen(false)}
                />
              </div>

              {/* Mobile User Menu */}
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          Administrador
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
