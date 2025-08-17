
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
// Removed AdminErrorBoundary wrapper to avoid full-screen error overlay
import { AdminHeader } from '@/components/admin/AdminHeader';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [navigationLock, setNavigationLock] = React.useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  console.log('AdminLayout - Auth State:', { user: !!user, loading, isAdmin });

  // Controle de navegação com AbortController
  React.useEffect(() => {
    // Cancelar requisições anteriores se houver
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!loading) {
      // Implementar debounce/lock para evitar múltiplos redirects
      if (navigationLock) return;

      if (!user) {
        setNavigationLock(true);
        console.warn('AdminLayout - No user, redirecting to auth');
        navigate('/auth', { replace: true });
        setTimeout(() => setNavigationLock(false), 1000);
      } else if (!isAdmin) {
        setNavigationLock(true);
        console.warn('AdminLayout - User is not admin, redirecting to home');
        navigate('/', { replace: true });
        setTimeout(() => setNavigationLock(false), 1000);
      }
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, isAdmin, loading, navigate, navigationLock]);

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
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto p-4 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
