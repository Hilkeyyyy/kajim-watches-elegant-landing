
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';
import { AdminHeader } from '@/components/admin/AdminHeader';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

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
    <AdminErrorBoundary>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto p-4 max-w-7xl">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminLayout;
