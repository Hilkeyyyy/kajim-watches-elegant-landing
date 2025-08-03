import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardOverview } from '@/components/admin/dashboard/DashboardOverview';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeProducts: 0,
    featuredProducts: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: productsCount },
        { count: activeProductsCount },
        { count: featuredProductsCount },
        { count: lowStockProductsCount },
        { count: categoriesCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 10),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        totalUsers: usersCount || 0,
        activeProducts: activeProductsCount || 0,
        featuredProducts: featuredProductsCount || 0,
        lowStockProducts: lowStockProductsCount || 0,
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de administração
        </p>
      </div>

      <DashboardOverview stats={stats} isLoading={loading} />
    </div>
  );
};

export default Dashboard;