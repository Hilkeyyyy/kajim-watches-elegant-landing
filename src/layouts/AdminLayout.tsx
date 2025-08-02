
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const AdminLayout = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 h-14 flex items-center border-b bg-background z-40 px-4">
          <SidebarTrigger className="mr-3" />
          <h1 className="text-lg font-semibold truncate">
            <span className="hidden sm:inline">Painel Administrativo - </span>
            KAJIM Store
          </h1>
        </header>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 pt-14 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
