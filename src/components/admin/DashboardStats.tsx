import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatsData {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  totalUsers: number;
  adminUsers: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    featuredProducts: 0,
    totalUsers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch product stats
        const { data: products } = await supabase
          .from('products')
          .select('status, stock_status, is_featured');

        const { data: profiles } = await supabase
          .from('profiles')
          .select('role');

        if (products) {
          setStats({
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'active').length,
            outOfStockProducts: products.filter(p => p.stock_status === 'out_of_stock').length,
            featuredProducts: products.filter(p => p.is_featured).length,
            totalUsers: profiles?.length || 0,
            adminUsers: profiles?.filter(p => p.role === 'admin').length || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total de Produtos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Produtos Ativos",
      value: stats.activeProducts,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Produtos Esgotados",
      value: stats.outOfStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Produtos em Destaque",
      value: stats.featuredProducts,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {stat.value > 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Vazio
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};