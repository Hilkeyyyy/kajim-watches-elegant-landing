
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  console.log('AdminLayout - Auth State:', { user: !!user, loading, isAdmin });

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

  // Authentication check
  if (!user) {
    console.warn('AdminLayout - No user, redirecting to auth');
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    console.warn('AdminLayout - User is not admin, redirecting to home');
    navigate('/');
    return null;
  }

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 p-6">
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
