
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Package, 
  FolderOpen, 
  FileText, 
  Settings,
  Edit3
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

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
      title: 'Relatórios',
      href: '/admin/relatorios',
      icon: FileText
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/10 overflow-visible">
        <Sidebar className="border-r border-border/40 z-50 overflow-visible">
          <SidebarContent className="p-4 overflow-visible">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">KAJIM RELÓGIOS</p>
            </div>
            
            <nav className="space-y-2 overflow-visible">
              {menuItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative z-10 ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger className="z-50" />
              <AdminHeader />
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto min-h-0">
            <AdminErrorBoundary>
              <Outlet />
            </AdminErrorBoundary>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
