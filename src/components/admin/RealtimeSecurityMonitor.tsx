import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, AlertTriangle, Activity, Eye, RefreshCw, Clock, 
  Users, Zap, Bell, Globe, Lock, UserX 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

interface RealtimeSecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

interface SecurityAlert {
  id: string;
  type: 'threat' | 'breach' | 'anomaly' | 'policy_violation';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  auto_resolved?: boolean;
}

export const RealtimeSecurityMonitor: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { notifyError, notifyWarning } = useNotifications();
  
  const [events, setEvents] = useState<RealtimeSecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [stats, setStats] = useState({
    activeThreats: 0,
    blockedIPs: 0,
    suspiciousUsers: 0,
    totalEvents: 0
  });

  useEffect(() => {
    if (isAdmin) {
      initializeRealtimeMonitoring();
      loadInitialData();
    }
    return () => {
      // Cleanup subscriptions
      supabase.removeAllChannels();
    };
  }, [isAdmin]);

  const initializeRealtimeMonitoring = () => {
    const channel = supabase
      .channel('security-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs'
        },
        (payload) => {
          const newEvent = payload.new as RealtimeSecurityEvent;
          handleNewSecurityEvent(newEvent);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('✅ Monitor de segurança em tempo real ativo');
        } else {
          setIsConnected(false);
          console.log('❌ Falha na conexão do monitor de segurança');
        }
      });
  };

  const loadInitialData = async () => {
    try {
      // Carregar eventos recentes
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (eventsError) throw eventsError;

      const recentEvents = (eventsData || []).map(event => ({
        ...event,
        severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
        ip_address: event.ip_address as string | undefined,
        user_agent: event.user_agent as string | undefined,
        user_id: event.user_id as string | undefined
      }));
      setEvents(recentEvents);

      // Calcular estatísticas
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const recentCriticalEvents = recentEvents.filter(e => 
        e.severity === 'critical' && new Date(e.created_at) > oneHourAgo
      );
      
      const recentHighEvents = recentEvents.filter(e => 
        e.severity === 'high' && new Date(e.created_at) > oneHourAgo
      );

      // Determinar nível de ameaça
      if (recentCriticalEvents.length > 0) {
        setThreatLevel('critical');
      } else if (recentHighEvents.length > 2) {
        setThreatLevel('high');
      } else if (recentHighEvents.length > 0) {
        setThreatLevel('medium');
      } else {
        setThreatLevel('low');
      }

      setStats({
        activeThreats: recentCriticalEvents.length + recentHighEvents.length,
        blockedIPs: new Set(recentEvents.map(e => e.ip_address).filter(Boolean)).size,
        suspiciousUsers: new Set(recentEvents.filter(e => 
          e.event_type.includes('unauthorized') || e.event_type.includes('suspicious')
        ).map(e => e.user_id).filter(Boolean)).size,
        totalEvents: recentEvents.length
      });

    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const handleNewSecurityEvent = (event: RealtimeSecurityEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 19)]);
    
    // Atualizar estatísticas
    setStats(prev => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      activeThreats: event.severity === 'critical' || event.severity === 'high' 
        ? prev.activeThreats + 1 
        : prev.activeThreats
    }));

    // Gerar alertas para eventos críticos
    if (event.severity === 'critical') {
      const alert: SecurityAlert = {
        id: `alert-${Date.now()}`,
        type: 'threat',
        message: `Evento crítico detectado: ${event.event_type}`,
        severity: 'critical',
        timestamp: new Date().toISOString()
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
      
      notifyError(
        'Ameaça Crítica Detectada!',
        `${event.event_type} - Investigação imediata necessária`
      );
    } else if (event.severity === 'high') {
      notifyWarning(
        'Evento de Alta Severidade',
        `${event.event_type} detectado`
      );
    }

    // Atualizar nível de ameaça
    updateThreatLevel(event);
  };

  const updateThreatLevel = (newEvent: RealtimeSecurityEvent) => {
    if (newEvent.severity === 'critical') {
      setThreatLevel('critical');
    } else if (newEvent.severity === 'high' && threatLevel !== 'critical') {
      setThreatLevel('high');
    }
  };

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default: return 'text-green-500 bg-green-50 border-green-200';
    }
  };

  const getThreatLevelText = () => {
    switch (threatLevel) {
      case 'critical': return 'CRÍTICO';
      case 'high': return 'ALTO';
      case 'medium': return 'MÉDIO';
      default: return 'BAIXO';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
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

  return (
    <div className="space-y-6">
      {/* Status de Conexão e Nível de Ameaça */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
              Status do Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Monitoramento em Tempo Real</span>
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'CONECTADO' : 'DESCONECTADO'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Nível de Ameaça
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-3 rounded-lg border ${getThreatLevelColor()}`}>
              <div className="font-bold text-lg text-center">
                {getThreatLevelText()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas em Tempo Real */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ameaças Ativas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Última hora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Suspeitos</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Endereços únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Suspeitos</CardTitle>
            <UserX className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspiciousUsers}</div>
            <p className="text-xs text-muted-foreground">Atividade suspeita</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Eventos recentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Ativos */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-500" />
              Alertas Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eventos em Tempo Real */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Eventos em Tempo Real
            </CardTitle>
            <Button onClick={loadInitialData} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getSeverityIcon(event.severity)}
                  <div>
                    <p className="font-medium text-sm">{event.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.ip_address && `IP: ${event.ip_address}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={event.severity === 'critical' ? 'destructive' : 'outline'}>
                    {event.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.created_at).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aguardando eventos de segurança...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};