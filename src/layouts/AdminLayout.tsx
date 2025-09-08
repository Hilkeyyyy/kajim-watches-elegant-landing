
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  FileText, 
  Edit3,
  Home,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const AdminLayout = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log de tentativas de acesso não autorizado
    if (!loading && (!user || !isAdmin)) {
      const logUnauthorizedAccess = async () => {
        try {
          await supabase.rpc('log_security_event', {
            p_event_type: 'unauthorized_admin_access_attempt',
            p_details: {
              attempted_path: location.pathname,
              user_id: user?.id || null,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              referrer: document.referrer || null
            },
            p_severity: 'high'
          });
        } catch (error) {
          console.error('Failed to log unauthorized access:', error);
        }
      };
      
      logUnauthorizedAccess();
    }
  }, [user, isAdmin, loading, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: BarChart3
    },
    {
      title: 'Produtos',
      href: '/admin/produtos',
      icon: Package
    },
    {
      title: 'Categorias',
      href: '/admin/categorias', 
      icon: FolderOpen
    },
    {
      title: 'Editor do Site',
      href: '/admin/editor',
      icon: Edit3
    },
    {
      title: 'Editor do Rodapé',
      href: '/admin/editor-rodape',
      icon: Edit3
    },
    {
      title: 'Editor de Conteúdo',
      href: '/admin/editor-conteudo',
      icon: FileText
    },
    {
      title: 'Relatórios',
      href: '/admin/relatorios',
      icon: BarChart3
    },
    {
      title: 'Segurança',
      href: '/admin/seguranca',
      icon: Shield
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-foreground">KAJIM Admin</h1>
                  <p className="text-xs text-muted-foreground">Painel Administrativo</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Menu & Mobile Navigation */}
            <div className="flex items-center gap-2">
              {/* Mobile Navigation */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Package className="w-4 h-4" />
                      <span className="sr-only">Menu de navegação</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden">
                    {menuItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <NavLink 
                          to={item.href}
                          className={`flex items-center gap-2 w-full ${
                            isActive(item.href) ? 'bg-muted' : ''
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.title}
                        </NavLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {user?.email?.split('@')[0] || 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden">
                  <DropdownMenuItem asChild>
                    <NavLink to="/" className="flex items-center gap-2 w-full">
                      <Home className="w-4 h-4" />
                      Ver Site
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>
    </div>
  );
};

export default AdminLayout;
