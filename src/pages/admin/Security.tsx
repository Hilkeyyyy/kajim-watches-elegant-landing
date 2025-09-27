import React from 'react';
import { SecurityMonitor } from '@/components/admin/SecurityMonitor';
import { SecurityValidator } from '@/components/admin/SecurityValidator';
import { SecurityDashboard } from '@/components/admin/SecurityDashboard';
import { RealtimeSecurityMonitor } from '@/components/admin/RealtimeSecurityMonitor';
import { SecurityRateLimiter } from '@/components/admin/SecurityRateLimiter';
import { SecurityReporting } from '@/components/admin/SecurityReporting';
import { SecurityEnhancer } from '@/components/admin/SecurityEnhancer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, CheckCircle, Info, Activity, Clock, FileText, Ban } from 'lucide-react';
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
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>OTP Expiry (24h)</span>
                    <Badge variant="destructive">CRÍTICO</Badge>
                  </div>
                  <p className="text-sm text-red-600">
                    ⚠️ VULNERABILIDADE: Tempo de expiração do OTP muito longo (24h). Configure para 15-30 minutos.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acesse: Supabase Dashboard → Authentication → Settings → Auth
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Proteção contra Senhas Vazadas</span>
                    <Badge variant="destructive">CRÍTICO</Badge>
                  </div>
                  <p className="text-sm text-red-600">
                    ⚠️ VULNERABILIDADE: Proteção contra senhas comprometidas desabilitada.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acesse: Supabase Dashboard → Authentication → Settings → Password Security
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>PostgreSQL Versão</span>
                    <Badge variant="destructive">ATUALIZAR</Badge>
                  </div>
                  <p className="text-sm text-orange-600">
                    ⚠️ SEGURANÇA: Patches de segurança disponíveis para PostgreSQL.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Acesse: Supabase Dashboard → Settings → General → Infrastructure
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

      {/* Tabs para diferentes módulos de segurança */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="enhancer" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Aprimorador
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tempo Real
          </TabsTrigger>
          <TabsTrigger value="ratelimit" className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Rate Limit
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="enhancer">
          <SecurityEnhancer />
        </TabsContent>

        <TabsContent value="realtime">
          <RealtimeSecurityMonitor />
        </TabsContent>

        <TabsContent value="ratelimit">
          <SecurityRateLimiter />
        </TabsContent>

        <TabsContent value="reports">
          <SecurityReporting />
        </TabsContent>

        <TabsContent value="monitor">
          <SecurityMonitor />
        </TabsContent>

        <TabsContent value="validator">
          <SecurityValidator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;