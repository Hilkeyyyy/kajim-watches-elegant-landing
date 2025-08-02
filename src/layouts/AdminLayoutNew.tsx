import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AdminSidebarNew } from '@/components/AdminSidebarNew';
import { AdminHeaderNew } from '@/components/AdminHeaderNew';

const AdminLayoutNew = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

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
    navigate('/auth');
    return null;
  }

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        {/* Layout Grid */}
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebarNew />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <AdminHeaderNew />
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6 space-y-6">
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminLayoutNew;