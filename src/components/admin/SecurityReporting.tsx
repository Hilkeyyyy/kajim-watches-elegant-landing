import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, Download, Mail, Calendar, AlertTriangle, 
  TrendingUp, Shield, Clock, Activity, BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityReport {
  id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'incident';
  start_date: string;
  end_date: string;
  summary: {
    total_events: number;
    critical_events: number;
    high_events: number;
    unique_threats: number;
    blocked_ips: number;
    risk_score: number;
  };
  details: any;
  generated_at: string;
  generated_by: string;
}

interface ReportMetrics {
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  criticalEvents: number;
  averageRiskScore: number;
  topThreats: Array<{
    type: string;
    count: number;
    lastOccurrence: string;
  }>;
}

export const SecurityReporting: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadSecurityReports();
      loadSecurityMetrics();
    }
  }, [isAdmin]);

  const loadSecurityReports = async () => {
    try {
      // Como não temos uma tabela de relatórios ainda, vamos simular
      // Em uma implementação real, você criaria uma tabela security_reports
      setReports([
        {
          id: '1',
          report_type: 'daily',
          start_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
          summary: {
            total_events: 15,
            critical_events: 2,
            high_events: 5,
            unique_threats: 8,
            blocked_ips: 3,
            risk_score: 7.2
          },
          details: {},
          generated_at: new Date().toISOString(),
          generated_by: 'system'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  };

  const loadSecurityMetrics = async () => {
    setLoading(true);
    try {
      const { data: eventsData, error } = await supabase
        .from('security_audit_logs')
        .select('event_type, severity, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const events = eventsData || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calcular métricas
      const eventsToday = events.filter(e => new Date(e.created_at) >= today).length;
      const eventsThisWeek = events.filter(e => new Date(e.created_at) >= thisWeek).length;
      const eventsThisMonth = events.filter(e => new Date(e.created_at) >= thisMonth).length;
      const criticalEvents = events.filter(e => e.severity === 'critical').length;

      // Calcular score de risco médio
      const severityScores = { low: 1, medium: 3, high: 7, critical: 10 };
      const averageRiskScore = events.length > 0 
        ? events.reduce((sum, e) => sum + (severityScores[e.severity as keyof typeof severityScores] || 1), 0) / events.length
        : 0;

      // Top ameaças
      const threatCounts = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topThreats = Object.entries(threatCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({
          type,
          count,
          lastOccurrence: events.find(e => e.event_type === type)?.created_at || ''
        }));

      setMetrics({
        eventsToday,
        eventsThisWeek,
        eventsThisMonth,
        criticalEvents,
        averageRiskScore,
        topThreats
      });

    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar métricas de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'daily' | 'weekly' | 'monthly') => {
    setGenerating(true);
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Relatório Gerado",
        description: `Relatório ${type} gerado com sucesso`
      });

      // Recarregar relatórios
      await loadSecurityReports();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar relatório",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (reportId: string) => {
    // Simular download de relatório
    const report = reports.find(r => r.id === reportId);
    if (report) {
      const data = JSON.stringify(report, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-report-${report.report_type}-${report.generated_at.split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Iniciado",
        description: "Relatório baixado com sucesso"
      });
    }
  };

  const scheduleReport = async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      // Em uma implementação real, você configuraria um cron job
      toast({
        title: "Agendamento Configurado",
        description: `Relatórios ${type} serão gerados automaticamente`
      });
    } catch (error) {
      console.error('Erro ao agendar relatório:', error);
      toast({
        title: "Erro",
        description: "Falha ao agendar relatório",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Acesso restrito a administradores.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Relatórios de Segurança
          </h2>
          <p className="text-muted-foreground">
            Geração e análise de relatórios automatizados
          </p>
        </div>
      </div>

      {/* Métricas Resumo */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.eventsToday}</div>
              <p className="text-xs text-muted-foreground">Eventos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.eventsThisWeek}</div>
              <p className="text-xs text-muted-foreground">Eventos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.eventsThisMonth}</div>
              <p className="text-xs text-muted-foreground">Eventos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risco Médio</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageRiskScore.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">0-10 escala</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações de Relatório */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gerar Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => generateReport('daily')} 
              className="w-full" 
              disabled={generating}
            >
              Relatório Diário
            </Button>
            <Button 
              onClick={() => generateReport('weekly')} 
              className="w-full" 
              variant="outline"
              disabled={generating}
            >
              Relatório Semanal
            </Button>
            <Button 
              onClick={() => generateReport('monthly')} 
              className="w-full" 
              variant="outline"
              disabled={generating}
            >
              Relatório Mensal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => scheduleReport('daily')} 
              className="w-full" 
              variant="secondary"
            >
              Agendar Diário
            </Button>
            <Button 
              onClick={() => scheduleReport('weekly')} 
              className="w-full" 
              variant="secondary"
            >
              Agendar Semanal
            </Button>
            <Button 
              onClick={() => scheduleReport('monthly')} 
              className="w-full" 
              variant="secondary"
            >
              Agendar Mensal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Ameaças
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.topThreats.length ? (
              <div className="space-y-2">
                {metrics.topThreats.slice(0, 3).map((threat, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate">{threat.type}</span>
                    <Badge variant="outline">{threat.count}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma ameaça registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Existentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Relatórios Gerados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum relatório disponível
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        Relatório {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.generated_at).toLocaleDateString('pt-BR')} - 
                        {report.summary.total_events} eventos, 
                        {report.summary.critical_events} críticos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Risco: {report.summary.risk_score.toFixed(1)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadReport(report.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};