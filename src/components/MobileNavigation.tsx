import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';

export const MobileNavigation = () => {
  const location = useLocation();
  const { getTotalItems, favorites } = useApp();

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Início',
      count: 0
    },
    {
      href: '/buscar',
      icon: Search,
      label: 'Buscar',
      count: 0
    },
    {
      href: '/favoritos',
      icon: Heart,
      label: 'Favoritos',
      count: favorites.length
    },
    {
      href: '/carrinho',
      icon: ShoppingCart,
      label: 'Carrinho',
      count: getTotalItems()
    },
    {
      href: '/auth',
      icon: User,
      label: 'Conta',
      count: 0
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 p-2 block md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive(item.href)
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.count > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs bg-gradient-to-r from-primary to-accent border-0"
                >
                  {item.count > 99 ? '99+' : item.count}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};