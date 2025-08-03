import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ReportData {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStock: number;
  featuredProducts: number;
  recentProducts: number;
  productsByCategory: Array<{
    name: string;
    count: number;
  }>;
  productsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  stockStatus: Array<{
    status: string;
    count: number;
  }>;
  recentActivity: Array<{
    action: string;
    date: string;
    item: string;
  }>;
}

export const useReports = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar produtos
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      // Buscar categorias
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Calcular estatísticas
      const totalProducts = products?.length || 0;
      const totalCategories = categories?.length || 0;
      const totalUsers = profiles?.length || 0;

      const activeProducts = products?.filter(p => p.status === 'active').length || 0;
      const inactiveProducts = products?.filter(p => p.status === 'inactive').length || 0;
      const discontinuedProducts = products?.filter(p => p.status === 'out_of_stock').length || 0;
      const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;
      const featuredProducts = products?.filter(p => p.is_featured).length || 0;

      // Produtos criados nos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentProducts = products?.filter(p => 
        new Date(p.created_at) > thirtyDaysAgo
      ).length || 0;

      // Produtos por categoria (usando brand como categoria)
      const brandCounts = products?.reduce((acc, product) => {
        const brand = product.brand || 'Sem marca';
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const productsByCategory = Object.entries(brandCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Status dos produtos
      const statusCounts = {
        active: activeProducts,
        inactive: inactiveProducts,
        out_of_stock: discontinuedProducts
      };

      const productsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status: status === 'active' ? 'Ativo' : 
                status === 'inactive' ? 'Inativo' : 'Sem estoque',
        count,
        percentage: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
      }));

      // Status do estoque
      const inStock = products?.filter(p => p.stock_quantity > 0).length || 0;
      const lowStock = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length || 0;

      const stockStatus = [
        { status: 'Em estoque', count: inStock },
        { status: 'Estoque baixo', count: lowStock },
        { status: 'Sem estoque', count: outOfStock }
      ];

      // Atividade recente (simplificada)
      const recentActivity = [
        {
          action: 'Produtos criados',
          date: 'Últimos 30 dias',
          item: `${recentProducts} produto(s)`
        },
        {
          action: 'Total de produtos',
          date: 'Atual',
          item: `${totalProducts} produto(s)`
        },
        {
          action: 'Produtos em destaque',
          date: 'Atual',
          item: `${featuredProducts} produto(s)`
        }
      ];

      const reportData: ReportData = {
        totalProducts,
        totalCategories,
        totalUsers,
        activeProducts,
        inactiveProducts,
        outOfStock,
        featuredProducts,
        recentProducts,
        productsByCategory,
        productsByStatus,
        stockStatus,
        recentActivity
      };

      setData(reportData);
    } catch (err) {
      console.error('Erro ao buscar relatórios:', err);
      setError('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchReports
  };
};