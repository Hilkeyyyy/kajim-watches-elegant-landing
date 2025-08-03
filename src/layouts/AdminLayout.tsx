
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('AdminLayout - Auth State:', { user: !!user, loading, isAdmin });

  // Early returns para evitar re-renders desnecessários
  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn('AdminLayout - No user, redirecting to auth');
        navigate('/auth', { replace: true });
      } else if (!isAdmin) {
        console.warn('AdminLayout - User is not admin, redirecting to home');
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-muted-foreground">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário ou não é admin, não renderiza nada (redirecionamento já aconteceu no useEffect)
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 p-3 sm:p-6 overflow-x-auto">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default AdminLayout;
