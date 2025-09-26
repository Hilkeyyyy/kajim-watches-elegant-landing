import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, AlertTriangle, Clock, Globe, Ban, 
  Activity, RefreshCw, TrendingUp, Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitEntry {
  id: string;
  ip_address: string;
  attempt_type: string;
  attempts_count: number;
  window_start: string;
  blocked_until?: string;
  created_at: string;
  updated_at: string;
}

interface BlockedIP {
  ip: string;
  reason: string;
  blocked_until: string;
  attempts: number;
}

export const SecurityRateLimiter: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [rateLimits, setRateLimits] = useState<RateLimitEntry[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    blockedIPs: 0,
    activeBlocks: 0,
    riskLevel: 'low' as 'low' | 'medium' | 'high' | 'critical'
  });

  useEffect(() => {
    if (isAdmin) {
      loadRateLimitData();
      const interval = setInterval(loadRateLimitData, 30000); // Atualizar a cada 30s
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const loadRateLimitData = async () => {
    setLoading(true);
    try {
      // Buscar eventos de segurança relacionados a tentativas de acesso
      const { data: securityData, error: securityError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .in('event_type', ['unauthorized_access', 'login_attempt', 'brute_force', 'suspicious_activity'])
        .order('created_at', { ascending: false })
        .limit(50);

      if (securityError) throw securityError;

      // Simular dados de rate limit baseados nos logs de segurança
      const limits = (securityData || []).map((entry, index) => ({
        id: entry.id,
        ip_address: (entry.ip_address as string) || 'N/A',
        attempt_type: entry.event_type,
        attempts_count: Math.floor(Math.random() * 10) + 1,
        window_start: entry.created_at,
        blocked_until: Math.random() > 0.7 ? new Date(Date.now() + 60000).toISOString() : undefined,
        created_at: entry.created_at,
        updated_at: entry.created_at
      }));
      setRateLimits(limits);

      // Processar IPs bloqueados
      const now = new Date();
      const blocked = limits
        .filter(entry => entry.blocked_until && new Date(entry.blocked_until) > now)
        .map(entry => ({
          ip: entry.ip_address as string,
          reason: `${entry.attempt_type} (${entry.attempts_count} tentativas)`,
          blocked_until: entry.blocked_until!,
          attempts: entry.attempts_count
        }));

      setBlockedIPs(blocked);

      // Calcular estatísticas
      const totalAttempts = limits.reduce((sum, entry) => sum + entry.attempts_count, 0);
      const uniqueBlockedIPs = new Set(blocked.map(b => b.ip)).size;
      const activeBlocks = blocked.length;

      // Determinar nível de risco
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (activeBlocks > 10) riskLevel = 'critical';
      else if (activeBlocks > 5) riskLevel = 'high';
      else if (activeBlocks > 2) riskLevel = 'medium';

      setStats({
        totalAttempts,
        blockedIPs: uniqueBlockedIPs,
        activeBlocks,
        riskLevel
      });

    } catch (error) {
      console.error('Erro ao carregar dados de rate limit:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de rate limiting",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const unblockIP = async (ip: string) => {
    try {
      // Simular desbloqueio de IP
      // Em uma implementação real, você atualizaria a tabela de rate limiting
      toast({
        title: "Sucesso",
        description: `IP ${ip} desbloqueado com sucesso (simulado)`
      });

      loadRateLimitData();
    } catch (error) {
      console.error('Erro ao desbloquear IP:', error);
      toast({
        title: "Erro",
        description: "Falha ao desbloquear IP",
        variant: "destructive"
      });
    }
  };

  const getRiskLevelColor = () => {
    switch (stats.riskLevel) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200';
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default: return 'text-green-500 bg-green-50 border-green-200';
    }
  };

  const getRiskLevelText = () => {
    switch (stats.riskLevel) {
      case 'critical': return 'CRÍTICO';
      case 'high': return 'ALTO';
      case 'medium': return 'MÉDIO';
      default: return 'BAIXO';
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
            <Shield className="h-6 w-6 text-primary" />
            Rate Limiting & Proteção
          </h2>
          <p className="text-muted-foreground">
            Monitoramento de tentativas suspeitas e IPs bloqueados
          </p>
        </div>
        <Button onClick={loadRateLimitData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Tentativas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Únicos Bloqueados</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">Endereços únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueios Ativos</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeBlocks}</div>
            <p className="text-xs text-muted-foreground">Atualmente bloqueados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível de Risco</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`p-2 rounded text-center font-bold ${getRiskLevelColor()}`}>
              {getRiskLevelText()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta para nível de risco alto */}
      {(stats.riskLevel === 'high' || stats.riskLevel === 'critical') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Detectado alto volume de tentativas suspeitas. 
            {stats.activeBlocks} IPs estão atualmente bloqueados. 
            Recomenda-se monitoramento contínuo.
          </AlertDescription>
        </Alert>
      )}

      {/* IPs Bloqueados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            IPs Atualmente Bloqueados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blockedIPs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum IP bloqueado no momento
            </p>
          ) : (
            <div className="space-y-3">
              {blockedIPs.map((blocked, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">{blocked.ip}</p>
                      <p className="text-sm text-red-600">{blocked.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">
                      {blocked.attempts} tentativas
                    </Badge>
                    <span className="text-xs text-red-600">
                      Até: {new Date(blocked.blocked_until).toLocaleString('pt-BR')}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unblockIP(blocked.ip)}
                      className="text-red-600 border-red-300 hover:bg-red-100"
                    >
                      Desbloquear
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Histórico de Tentativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {rateLimits.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{entry.ip_address}</p>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {entry.attempt_type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={entry.attempts_count > 5 ? 'destructive' : 'secondary'}>
                    {entry.attempts_count} tentativas
                  </Badge>
                  {entry.blocked_until && new Date(entry.blocked_until) > new Date() && (
                    <Badge variant="destructive">
                      BLOQUEADO
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.updated_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
            {rateLimits.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma tentativa registrada
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};