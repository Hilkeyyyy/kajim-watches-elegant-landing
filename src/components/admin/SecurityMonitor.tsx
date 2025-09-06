import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Info, Clock, User, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SecurityLog {
  id: string;
  event_type: string;
  user_id?: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const SecurityMonitor: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityLogs();
    }
  }, [isAdmin]);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs((data || []).map(log => ({
        ...log,
        severity: log.severity as 'low' | 'medium' | 'high' | 'critical'
      })));
    } catch (error: any) {
      console.error('Error fetching security logs:', error);
      setError('Erro ao carregar logs de segurança');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getEventTypeDescription = (eventType: string) => {
    const descriptions: Record<string, string> = {
      'product_search': 'Busca de produtos',
      'content_sanitized': 'Conteúdo sanitizado (possível XSS)',
      'dangerous_pattern_detected': 'Padrão perigoso detectado',
      'unauthorized_role_change_attempt': 'Tentativa não autorizada de mudança de role',
      'role_updated': 'Role de usuário atualizado',
      'invalid_role_attempt': 'Tentativa de role inválido',
      'input_too_long': 'Input muito longo',
      'invalid_file_type': 'Tipo de arquivo inválido',
      'file_too_large': 'Arquivo muito grande'
    };
    return descriptions[eventType] || eventType;
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitor de Segurança
          </CardTitle>
          <Button onClick={fetchSecurityLogs} size="sm" variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhum evento de segurança registrado.
          </p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(log.severity)}
                    <span className="font-medium">
                      {getEventTypeDescription(log.event_type)}
                    </span>
                    <Badge variant={getSeverityColor(log.severity) as any}>
                      {log.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </div>
                </div>
                
                {log.user_id && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    Usuário: {log.user_id}
                  </div>
                )}
                
                {log.details && Object.keys(log.details).length > 0 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Ver detalhes
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};