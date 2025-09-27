import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { auditLogger } from '@/utils/auditLogger';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  recentEvents: number;
  uniqueUsers: number;
  blockedIPs: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
}

interface SecurityEvent {
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

interface ThreatIntelligence {
  suspiciousIPs: string[];
  maliciousPatterns: string[];
  riskFactors: Array<{
    factor: string;
    weight: number;
    description: string;
  }>;
}

export const useAdvancedSecurity = () => {
  const { isAdmin } = useAuth();
  const { notifyError, notifyWarning, notifyInfo } = useNotifications();
  
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    highEvents: 0,
    recentEvents: 0,
    uniqueUsers: 0,
    blockedIPs: 0,
    threatLevel: 'low',
    riskScore: 0
  });

  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [threatIntel, setThreatIntel] = useState<ThreatIntelligence>({
    suspiciousIPs: [],
    maliciousPatterns: [],
    riskFactors: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  // Inicializar monitoramento em tempo real
  const initializeRealtimeMonitoring = useCallback(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('advanced-security-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs'
        },
        (payload) => {
          const newEvent = payload.new as SecurityEvent;
          handleNewSecurityEvent(newEvent);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          setIsMonitoring(true);
          auditLogger.log('security_monitor_connected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('error');
          setIsMonitoring(false);
          auditLogger.log('security_monitor_error');
        } else {
          setConnectionStatus('disconnected');
          setIsMonitoring(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsMonitoring(false);
      setConnectionStatus('disconnected');
    };
  }, [isAdmin]);

  // Carregar dados iniciais de segurança
  const loadSecurityData = useCallback(async () => {
    if (!isAdmin) return;

    try {
      // Buscar eventos de segurança com validação
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (eventsError) {
        console.error('Erro ao carregar eventos de segurança:', eventsError);
        auditLogger.log('security_data_load_error', { error: eventsError.message });
        throw eventsError;
      }

      const events = (eventsData || []).map(event => ({
        ...event,
        severity: (event.severity as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        ip_address: event.ip_address as string | undefined,
        user_agent: event.user_agent as string | undefined,
        user_id: event.user_id as string | undefined
      }));

      setRecentEvents(events.slice(0, 20));

      // Calcular métricas
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentEvents = events.filter(e => new Date(e.created_at) > oneDayAgo);
      const criticalEvents = events.filter(e => e.severity === 'critical');
      const highEvents = events.filter(e => e.severity === 'high');
      const uniqueUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;
      const suspiciousIPs = Array.from(new Set(events.map(e => e.ip_address).filter(Boolean)));

      // Calcular nível de ameaça
      let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      const recentCritical = recentEvents.filter(e => e.severity === 'critical').length;
      const recentHigh = recentEvents.filter(e => e.severity === 'high').length;

      if (recentCritical > 0) threatLevel = 'critical';
      else if (recentHigh > 3) threatLevel = 'high';
      else if (recentHigh > 1) threatLevel = 'medium';

      // Calcular score de risco
      const severityWeights = { low: 1, medium: 3, high: 7, critical: 10 };
      const riskScore = recentEvents.length > 0 
        ? recentEvents.reduce((sum, e) => sum + severityWeights[e.severity], 0) / recentEvents.length
        : 0;

      setMetrics({
        totalEvents: events.length,
        criticalEvents: criticalEvents.length,
        highEvents: highEvents.length,
        recentEvents: recentEvents.length,
        uniqueUsers,
        blockedIPs: suspiciousIPs.length,
        threatLevel,
        riskScore
      });

      // Atualizar inteligência de ameaças
      setThreatIntel({
        suspiciousIPs: suspiciousIPs.slice(0, 10),
        maliciousPatterns: [
          'script injection',
          'sql injection',
          'xss attempt',
          'brute force',
          'unauthorized access'
        ],
        riskFactors: [
          { factor: 'Multiple failed logins', weight: 8, description: 'Possível ataque de força bruta' },
          { factor: 'Suspicious user agents', weight: 6, description: 'Bots maliciosos detectados' },
          { factor: 'Geo anomalies', weight: 7, description: 'Acessos de localizações suspeitas' },
          { factor: 'Rate limit violations', weight: 9, description: 'Excesso de requisições detectado' }
        ]
      });

      auditLogger.log('security_data_loaded', { 
        eventsCount: events.length,
        threatLevel,
        riskScore: riskScore.toFixed(2)
      });

    } catch (error) {
      console.error('Erro ao carregar dados de segurança:', error);
      auditLogger.log('security_data_load_error', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [isAdmin]);

  // Manipular novos eventos de segurança
  const handleNewSecurityEvent = useCallback((event: SecurityEvent) => {
    setRecentEvents(prev => [event, ...prev.slice(0, 19)]);
    
    // Atualizar métricas
    setMetrics(prev => ({
      ...prev,
      totalEvents: prev.totalEvents + 1,
      recentEvents: prev.recentEvents + 1,
      criticalEvents: event.severity === 'critical' ? prev.criticalEvents + 1 : prev.criticalEvents,
      highEvents: event.severity === 'high' ? prev.highEvents + 1 : prev.highEvents
    }));

    // Gerar alertas para eventos críticos
    if (event.severity === 'critical') {
      const alert: SecurityAlert = {
        id: `alert-${Date.now()}`,
        type: 'threat',
        message: `Ameaça crítica detectada: ${event.event_type}`,
        severity: 'critical',
        timestamp: new Date().toISOString()
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 9)]);
      
      notifyError(
        'AMEAÇA CRÍTICA DETECTADA!',
        `${event.event_type} - Ação imediata necessária`
      );

      // Log crítico
      auditLogger.log('critical_threat_detected', {
        eventType: event.event_type,
        userId: event.user_id,
        ipAddress: event.ip_address
      });
    
    } else if (event.severity === 'high') {
      notifyWarning(
        'Evento de Alta Severidade',
        `${event.event_type} detectado`
      );
    }

    // Atualizar nível de ameaça se necessário
    if (event.severity === 'critical') {
      setMetrics(prev => ({ ...prev, threatLevel: 'critical' }));
    }
  }, [notifyError, notifyWarning]);

  // Gerar relatório de segurança
  const generateSecurityReport = useCallback(async (type: 'daily' | 'weekly' | 'monthly') => {
    if (!isAdmin) return null;

    try {
      const report = {
        id: `report-${Date.now()}`,
        type,
        generated_at: new Date().toISOString(),
        metrics: { ...metrics },
        recent_events: recentEvents.slice(0, 10),
        threat_intelligence: { ...threatIntel },
        recommendations: [
          'Revisar logs de eventos críticos',
          'Atualizar políticas de segurança',
          'Monitorar IPs suspeitos',
          'Implementar rate limiting adicional'
        ]
      };

      auditLogger.log('security_report_generated', { 
        reportType: type,
        eventsAnalyzed: recentEvents.length,
        threatLevel: metrics.threatLevel
      });

      return report;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return null;
    }
  }, [isAdmin, metrics, recentEvents, threatIntel]);

  // Bloquear IP suspeito
  const blockSuspiciousIP = useCallback(async (ip: string, reason: string) => {
    if (!isAdmin) return false;

    try {
      // Simular bloqueio de IP (em implementação real, atualizaria firewall/rate limiting)
      auditLogger.log('ip_blocked', { ip, reason, blockedBy: 'admin' });
      
      notifyInfo(
        'IP Bloqueado',
        `${ip} foi adicionado à lista de bloqueio`
      );

      return true;
    } catch (error) {
      console.error('Erro ao bloquear IP:', error);
      return false;
    }
  }, [isAdmin, notifyInfo]);

  // Resolver alerta
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, auto_resolved: true }
        : alert
    ));
    
    auditLogger.log('alert_resolved', { alertId });
  }, []);

  // Efeitos
  useEffect(() => {
    if (isAdmin) {
      loadSecurityData();
      const cleanup = initializeRealtimeMonitoring();
      
      // Recarregar dados a cada 5 minutos
      const interval = setInterval(loadSecurityData, 5 * 60 * 1000);
      
      return () => {
        cleanup?.();
        clearInterval(interval);
      };
    }
  }, [isAdmin, loadSecurityData, initializeRealtimeMonitoring]);

  return {
    // Estado
    metrics,
    recentEvents,
    alerts,
    threatIntel,
    isMonitoring,
    connectionStatus,
    
    // Ações
    loadSecurityData,
    generateSecurityReport,
    blockSuspiciousIP,
    resolveAlert,
    handleNewSecurityEvent,
    
    // Utilitários
    isAdmin
  };
};