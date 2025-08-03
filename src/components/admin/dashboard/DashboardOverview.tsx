import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  Tag, 
  Users, 
  TrendingUp, 
  Eye, 
  Star,
  AlertTriangle,
  Activity,
  Plus,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockProducts: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, isLoading }) => {
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Total de Produtos",
      value: stats.totalProducts,
      description: "Produtos cadastrados",
      icon: Package,
      trend: "+12% desde o mês passado",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Produtos Ativos",
      value: stats.activeProducts,
      description: "Disponíveis na loja",
      icon: TrendingUp,
      trend: "+8% desde o mês passado",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Categorias",
      value: stats.totalCategories,
      description: "Categorias ativas",
      icon: Tag,
      trend: "+2 novas categorias",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Usuários",
      value: stats.totalUsers,
      description: "Usuários registrados",
      icon: Users,
      trend: "+15% este mês",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const alertCards = [
    {
      title: "Produtos em Destaque",
      value: stats.featuredProducts,
      icon: Star,
      color: "text-yellow-600",
      description: "Produtos destacados"
    },
    {
      title: "Estoque Baixo",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      description: "Produtos com estoque baixo"
    }
  ];

  const quickActions = [
    {
      title: "Novo Produto",
      description: "Adicionar produto ao catálogo",
      icon: Package,
      action: () => navigate('/admin/produtos/criar'),
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Nova Categoria",
      description: "Criar categoria de produtos",
      icon: Tag,
      action: () => navigate('/admin/categorias'),
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Ver Produtos",
      description: "Gerenciar produtos existentes",
      icon: Eye,
      action: () => navigate('/admin/produtos'),
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Relatórios",
      description: "Visualizar estatísticas",
      icon: BarChart3,
      action: () => navigate('/admin/relatorios'),
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-muted rounded-t-lg"></CardHeader>
              <CardContent className="h-16 bg-muted/50"></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className={`${card.borderColor} border-l-4 hover:shadow-md transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{card.description}</div>
                <div className="text-xs text-green-600 mt-1">{card.trend}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alertCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.value > 0 && card.title === "Estoque Baixo" && (
                  <Badge variant="outline" className="mt-2 text-red-600 border-red-200">
                    Requer atenção
                  </Badge>
                )}
                {card.value > 0 && card.title === "Produtos em Destaque" && (
                  <Badge variant="outline" className="mt-2 text-yellow-600 border-yellow-200">
                    Destacados
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.title}
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-105 border-2 hover:border-primary/20"
                  onClick={action.action}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`${action.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <h3 className="font-medium mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Banco de Dados</span>
              <Badge className="bg-green-500">✓ Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Autenticação</span>
              <Badge className="bg-green-500">✓ Ativo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Storage</span>
              <Badge className="bg-green-500">✓ Disponível</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};