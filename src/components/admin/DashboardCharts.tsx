import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, TrendingUp, Package, Target } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  count?: number;
  revenue?: number;
}

interface BrandData {
  brand: string;
  products: number;
  percentage: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const DashboardCharts = () => {
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [statusData, setStatusData] = useState<ChartData[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<ChartData[]>([]);
  const [stockData, setStockData] = useState<ChartData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'products' | 'revenue'>('products');

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados dos produtos
      const { data: products, error } = await supabase
        .from('products')
        .select('brand, price, status, stock_quantity, is_visible, is_featured');

      if (error) throw error;

      if (products) {
        // Dados por marca
        const brandCount: Record<string, number> = {};
        const brandRevenue: Record<string, number> = {};
        
        products.forEach(product => {
          const brand = product.brand || 'Sem marca';
          brandCount[brand] = (brandCount[brand] || 0) + 1;
          brandRevenue[brand] = (brandRevenue[brand] || 0) + parseFloat(product.price?.toString() || '0');
        });

        const brandChartData: BrandData[] = Object.entries(brandCount)
          .map(([brand, count]) => ({
            brand,
            products: count,
            percentage: (count / products.length) * 100
          }))
          .sort((a, b) => b.products - a.products)
          .slice(0, 6);

        setBrandData(brandChartData);

        // Dados por status
        const statusCount = products.reduce((acc, product) => {
          const status = product.status || 'active';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const statusChartData: ChartData[] = Object.entries(statusCount).map(([status, count]) => ({
          name: status === 'active' ? 'Ativo' : status === 'inactive' ? 'Inativo' : 'Descontinuado',
          value: count
        }));

        setStatusData(statusChartData);

        // Dados por faixa de preço
        const priceRanges = [
          { min: 0, max: 100, label: 'R$ 0-100' },
          { min: 100, max: 500, label: 'R$ 100-500' },
          { min: 500, max: 1000, label: 'R$ 500-1000' },
          { min: 1000, max: 5000, label: 'R$ 1000-5000' },
          { min: 5000, max: Infinity, label: 'R$ 5000+' }
        ];

        const priceRangeCount = priceRanges.map(range => {
          const count = products.filter(product => {
            const price = parseFloat(product.price?.toString() || '0');
            return price >= range.min && price < range.max;
          }).length;

          return {
            name: range.label,
            value: count
          };
        }).filter(item => item.value > 0);

        setPriceRangeData(priceRangeCount);

        // Dados de estoque
        const stockRanges = [
          { min: 0, max: 0, label: 'Sem estoque' },
          { min: 1, max: 5, label: 'Baixo (1-5)' },
          { min: 6, max: 20, label: 'Médio (6-20)' },
          { min: 21, max: Infinity, label: 'Alto (21+)' }
        ];

        const stockCount = stockRanges.map(range => {
          const count = products.filter(product => {
            const stock = product.stock_quantity || 0;
            return stock >= range.min && (range.max === Infinity ? true : stock <= range.max);
          }).length;

          return {
            name: range.label,
            value: count
          };
        });

        setStockData(stockCount);
      }
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">
            {`${payload[0].dataKey}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Análises e Gráficos</h3>
        <Select value={selectedMetric} onValueChange={(value: 'products' | 'revenue') => setSelectedMetric(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="products">Produtos</SelectItem>
            <SelectItem value="revenue">Receita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brands">Por Marca</TabsTrigger>
          <TabsTrigger value="status">Por Status</TabsTrigger>
          <TabsTrigger value="price">Por Preço</TabsTrigger>
          <TabsTrigger value="stock">Por Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Produtos por Marca (Gráfico de Barras)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={brandData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="products" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Distribuição por Marca (Pizza)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={brandData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="products"
                    >
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Status dos Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="price" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Distribuição por Faixa de Preço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Níveis de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};