import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityHeader {
  name: string;
  description: string;
  present: boolean;
  value?: string;
  recommended: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const SecurityHeaders: React.FC = () => {
  const { toast } = useToast();
  const [headers, setHeaders] = useState<SecurityHeader[]>([]);
  const [loading, setLoading] = useState(false);

  const checkSecurityHeaders = async () => {
    setLoading(true);
    try {
      // Simular verificação de headers de segurança
      // Em uma aplicação real, isso seria feito no servidor
      const headerChecks: SecurityHeader[] = [
        {
          name: 'Content-Security-Policy',
          description: 'Previne ataques XSS e injeção de código',
          present: false,
          recommended: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
          severity: 'high'
        },
        {
          name: 'X-Frame-Options',
          description: 'Previne ataques de clickjacking',
          present: false,
          recommended: 'DENY ou SAMEORIGIN',
          severity: 'medium'
        },
        {
          name: 'X-Content-Type-Options',
          description: 'Previne MIME type sniffing',
          present: false,
          recommended: 'nosniff',
          severity: 'medium'
        },
        {
          name: 'Referrer-Policy',
          description: 'Controla informações de referrer',
          present: false,
          recommended: 'strict-origin-when-cross-origin',
          severity: 'low'
        },
        {
          name: 'Permissions-Policy',
          description: 'Controla APIs do navegador',
          present: false,
          recommended: 'camera=(), microphone=(), geolocation=()',
          severity: 'medium'
        },
        {
          name: 'Strict-Transport-Security',
          description: 'Força conexões HTTPS',
          present: false,
          recommended: 'max-age=31536000; includeSubDomains',
          severity: 'high'
        }
      ];

      // Verificar headers presentes (limitado em SPA)
      // Esta implementação é básica - em produção seria verificado no servidor
      const response = await fetch(window.location.origin, { method: 'HEAD' });
      headerChecks.forEach(header => {
        const headerValue = response.headers.get(header.name.toLowerCase());
        if (headerValue) {
          header.present = true;
          header.value = headerValue;
        }
      });

      setHeaders(headerChecks);
      
      const missingCritical = headerChecks.filter(h => !h.present && (h.severity === 'critical' || h.severity === 'high')).length;
      if (missingCritical > 0) {
        toast({
          title: "Headers de Segurança",
          description: `${missingCritical} headers críticos não encontrados`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Erro ao verificar headers:', error);
      toast({
        title: "Erro",
        description: "Falha ao verificar headers de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSecurityHeaders();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (present: boolean) => {
    return present ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  const missingHeaders = headers.filter(h => !h.present);
  const criticalMissing = missingHeaders.filter(h => h.severity === 'critical' || h.severity === 'high');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Headers de Segurança
            </CardTitle>
            <CardDescription>
              Verificação de headers HTTP de segurança implementados
            </CardDescription>
          </div>
          <Button 
            onClick={checkSecurityHeaders} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalMissing.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> {criticalMissing.length} headers de segurança críticos estão ausentes.
              Isso pode deixar a aplicação vulnerável a ataques.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          {headers.map((header, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(header.present)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{header.name}</p>
                    <Badge variant={getSeverityColor(header.severity)} className="text-xs">
                      {header.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{header.description}</p>
                  {header.present && header.value && (
                    <p className="text-xs text-green-600 mt-1 font-mono">
                      Valor: {header.value}
                    </p>
                  )}
                  {!header.present && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Recomendado: <span className="font-mono">{header.recommended}</span>
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={header.present ? "default" : "destructive"}>
                {header.present ? "Presente" : "Ausente"}
              </Badge>
            </div>
          ))}
        </div>

        {missingHeaders.length > 0 && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Implementação:</strong> Para aplicações React/SPA, os headers de segurança devem ser configurados:
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                <li>No servidor web (Nginx, Apache)</li>
                <li>No CDN (Cloudflare, AWS CloudFront)</li>
                <li>Na plataforma de hospedagem (Vercel, Netlify)</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Nota:</strong> Esta verificação tem limitações em aplicações SPA. 
          Para uma análise completa, use ferramentas como SecurityHeaders.com ou Mozilla Observatory.</p>
        </div>
      </CardContent>
    </Card>
  );
};