import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Activity, Eye, RefreshCw, Clock, Users, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  total_events: number;
  critical_events: number;
  high_events: number;
  recent_events: number;
  unique_users: number;
  avg_events_per_day: number;
}

interface SecurityTrend {
  date: string;
  event_count: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export const SecurityDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [trends, setTrends] = useState<SecurityTrend[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityMetrics();
    }
  }, [isAdmin]);

  const fetchSecurityMetrics = async () => {
    setLoading(true);
    try {
      // Buscar eventos recentes diretamente
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;

      // Calcular métricas básicas dos eventos
      const events = eventsData || [];
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentEvents = events.filter(e => new Date(e.created_at) > oneDayAgo);
      const criticalEvents = events.filter(e => e.severity === 'critical');
      const highEvents = events.filter(e => e.severity === 'high');
      const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;

      setMetrics({
        total_events: events.length,
        critical_events: criticalEvents.length,
        high_events: highEvents.length,
        recent_events: recentEvents.length,
        unique_users: uniqueUsers,
        avg_events_per_day: Math.round(events.length / 7)
      });
      
      // Gerar tendências dos últimos 7 dias
      const trendData: SecurityTrend[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayEvents = events.filter(e => {
          const eventDate = new Date(e.created_at);
          return eventDate.toDateString() === date.toDateString();
        });
        
        trendData.push({
          date: date.toISOString().split('T')[0],
          event_count: dayEvents.length,
          severity_breakdown: {
            critical: dayEvents.filter(e => e.severity === 'critical').length,
            high: dayEvents.filter(e => e.severity === 'high').length,
            medium: dayEvents.filter(e => e.severity === 'medium').length,
            low: dayEvents.filter(e => e.severity === 'low').length,
          }
        });
      }
      
      setTrends(trendData);
      setRecentEvents(events);

    } catch (error) {
      console.error('Erro ao buscar métricas de segurança:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar métricas de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <Eye className="h-4 w-4 text-secondary-foreground" />;
      case 'low': return <Activity className="h-4 w-4 text-muted-foreground" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Acesso negado. Apenas administradores podem visualizar o dashboard de segurança.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Dashboard de Segurança
          </h1>
          <p className="text-muted-foreground">
            Monitoramento avançado de segurança e análise de ameaças
          </p>
        </div>
        <Button 
          onClick={fetchSecurityMetrics} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Alerta para eventos críticos */}
      {metrics && (metrics.critical_events > 0 || metrics.high_events > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> {metrics.critical_events} eventos críticos e {metrics.high_events} eventos de alta severidade detectados.
            Recomenda-se análise imediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Todos os eventos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics?.critical_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Recentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.recent_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.unique_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Com atividade registrada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visões */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Eventos Recentes</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Segurança Recentes</CardTitle>
              <CardDescription>
                Últimos 10 eventos registrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(event.severity)}
                      <div>
                        <p className="font-medium">{event.event_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      {event.user_id && (
                        <Badge variant="outline">
                          {event.user_id.substring(0, 8)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {recentEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum evento recente encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Segurança</CardTitle>
              <CardDescription>
                Análise de eventos dos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(trend.date).toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm text-muted-foreground">
                        {trend.event_count} eventos totais
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {trend.severity_breakdown.critical > 0 && (
                        <Badge variant="destructive">
                          {trend.severity_breakdown.critical} críticos
                        </Badge>
                      )}
                      {trend.severity_breakdown.high > 0 && (
                        <Badge variant="destructive">
                          {trend.severity_breakdown.high} altos
                        </Badge>
                      )}
                      {trend.severity_breakdown.medium > 0 && (
                        <Badge variant="secondary">
                          {trend.severity_breakdown.medium} médios
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {trends.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma tendência disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança Recomendadas</CardTitle>
              <CardDescription>
                Ações necessárias no painel do Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Configurações do Supabase Auth:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Alterar OTP Expiry Time de 86400s para 3600s (1 hora)</li>
                      <li>Habilitar "Leaked Password Protection"</li>
                      <li>Configurar Rate Limiting para signup/signin</li>
                      <li>Verificar Redirect URLs para produção</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Atualizações do Sistema:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Atualizar PostgreSQL para versão 15+</li>
                      <li>Revisar dependências do projeto</li>
                      <li>Configurar backup automático do banco</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button asChild variant="outline">
                    <a 
                      href="https://supabase.com/dashboard/project/nhzrqjlyaqxdjfnxuhht/auth/providers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Abrir Configurações do Supabase
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};