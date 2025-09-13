import React from 'react';
import { SecurityMonitor } from '@/components/admin/SecurityMonitor';
import { SecurityValidator } from '@/components/admin/SecurityValidator';
import { SecurityHeaders } from '@/components/admin/SecurityHeaders';
import { SecurityConfiguration } from '@/components/admin/SecurityConfiguration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Security: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Segurança
          </h1>
          <p className="text-muted-foreground">
            Monitoramento e logs de segurança do sistema
          </p>
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RLS Ativado</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Row Level Security em todas as tabelas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sanitização</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              DOMPurify para conteúdo HTML
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busca Segura</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Proteção contra SQL injection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditoria</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Logs de eventos de segurança
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Configurações de Autenticação
            </CardTitle>
            <CardDescription>
              Ajustes recomendados no Supabase Auth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>OTP Expiry</span>
                    <Badge variant="destructive">Configurar</Badge>
                  </div>
                  <p className="text-sm">
                    Configure o tempo de expiração do OTP para 15-30 minutos nas configurações do Supabase Auth.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Proteção contra Senhas Vazadas</span>
                    <Badge variant="destructive">Ativar</Badge>
                  </div>
                  <p className="text-sm">
                    Ative a proteção contra senhas comprometidas nas configurações do Supabase Auth.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Medidas de Segurança Ativas
            </CardTitle>
            <CardDescription>
              Recursos de segurança implementados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sanitização de HTML</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Validação de arquivos</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Controle de acesso (RLS)</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auditoria de ações admin</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Busca parametrizada</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <SecurityConfiguration />
        <SecurityHeaders />
        <SecurityMonitor />
        <SecurityValidator />
      </div>
    </div>
  );
};

export default Security;