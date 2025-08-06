import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Store, LogOut, Home } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const getPageInfo = (pathname: string) => {
  const routes: Record<string, { title: string; subtitle: string; breadcrumb: string[] }> = {
    '/admin': {
      title: 'Dashboard',
      subtitle: 'Visão geral do sistema',
      breadcrumb: ['Admin', 'Dashboard']
    },
    '/admin/produtos': {
      title: 'Produtos',
      subtitle: 'Gerenciar catálogo de produtos',
      breadcrumb: ['Admin', 'Produtos']
    },
    '/admin/categorias': {
      title: 'Categorias',
      subtitle: 'Organizar produtos por categoria',
      breadcrumb: ['Admin', 'Categorias']
    },
    '/admin/usuarios': {
      title: 'Usuários',
      subtitle: 'Gerenciar usuários do sistema',
      breadcrumb: ['Admin', 'Usuários']
    },
    '/admin/relatorios': {
      title: 'Relatórios',
      subtitle: 'Visualizar estatísticas e métricas',
      breadcrumb: ['Admin', 'Relatórios']
    },
    '/admin/configuracoes': {
      title: 'Configurações',
      subtitle: 'Configurações do sistema',
      breadcrumb: ['Admin', 'Configurações']
    },
  };

  return routes[pathname] || {
    title: 'Admin',
    subtitle: 'Painel administrativo',
    breadcrumb: ['Admin']
  };
};

export function AdminHeader() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const pageInfo = getPageInfo(location.pathname);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const adminItems = [
    { title: "Dashboard", url: "/admin" },
    { title: "Produtos", url: "/admin/produtos" },
    { title: "Categorias", url: "/admin/categorias" },
    { title: "Usuários", url: "/admin/usuarios" },
    { title: "Relatórios", url: "/admin/relatorios" },
  ];

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">KAJIM Admin</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              {adminItems.map((item) => (
                <Link
                  key={item.url}
                  to={item.url}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.url || 
                    (item.url !== '/admin' && location.pathname.startsWith(item.url))
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
            </Link>
            
            {user?.email && (
              <div className="hidden sm:block text-sm text-muted-foreground">
                {user.email}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {pageInfo.breadcrumb.slice(1).map((item, index) => (
                <React.Fragment key={item}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item}</BreadcrumbPage>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="text-right">
            <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
            <p className="text-xs text-muted-foreground">{pageInfo.subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}