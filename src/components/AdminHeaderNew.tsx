import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const getPageTitle = (pathname: string): { title: string; subtitle: string } => {
  switch (pathname) {
    case '/admin':
      return { title: 'Dashboard', subtitle: 'Visão geral do sistema' };
    case '/admin/produtos':
      return { title: 'Produtos', subtitle: 'Gerenciar catálogo de produtos' };
    case '/admin/categorias':
      return { title: 'Categorias', subtitle: 'Organizar produtos por categorias' };
    case '/admin/usuarios':
      return { title: 'Usuários', subtitle: 'Gerenciar usuários do sistema' };
    case '/admin/configuracoes':
      return { title: 'Configurações', subtitle: 'Configurações do sistema' };
    default:
      return { title: 'Painel Administrativo', subtitle: 'KAJIM Store' };
  }
};

export function AdminHeaderNew() {
  const location = useLocation();
  const { user } = useAuth();
  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10 w-64 bg-muted/50 border-border focus:bg-background"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium">{user?.email?.split('@')[0]}</div>
              <div className="text-xs text-muted-foreground">Administrador</div>
            </div>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}