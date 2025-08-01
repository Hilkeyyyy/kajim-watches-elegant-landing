import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Database, Mail, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da Loja */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Configurações da Loja
            </CardTitle>
            <CardDescription>
              Informações básicas sobre a loja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nome da Loja</Label>
              <Input
                id="store-name"
                defaultValue="KAJIM Store"
                placeholder="Nome da sua loja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-description">Descrição</Label>
              <Textarea
                id="store-description"
                defaultValue="Relógios de luxo e acessórios premium"
                placeholder="Descrição da loja"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Email de Contato</Label>
              <Input
                id="store-email"
                type="email"
                defaultValue="contato@kajimstore.com"
                placeholder="email@loja.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Telefone</Label>
              <Input
                id="store-phone"
                defaultValue="+55 (11) 99999-9999"
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure as notificações por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Pedidos</Label>
                <p className="text-sm text-muted-foreground">
                  Receber emails sobre novos pedidos
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Semanais</Label>
                <p className="text-sm text-muted-foreground">
                  Relatório semanal de vendas
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Estoque Baixo</Label>
                <p className="text-sm text-muted-foreground">
                  Alertas quando produtos estão em falta
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Notificações
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação em Dois Fatores</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar 2FA para maior segurança
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Obrigatório</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir login para visualizar produtos
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="60"
                min="15"
                max="480"
              />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Segurança
            </Button>
          </CardContent>
        </Card>

        {/* Manutenção do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5" />
              Manutenção
            </CardTitle>
            <CardDescription>
              Ferramentas de manutenção do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Limpar Cache</p>
                  <p className="text-sm text-muted-foreground">
                    Remove arquivos temporários
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Limpar
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Backup do Banco</p>
                  <p className="text-sm text-muted-foreground">
                    Criar backup dos dados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Backup
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Verificar Integridade</p>
                  <p className="text-sm text-muted-foreground">
                    Verificar consistência dos dados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Verificar
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium text-destructive">Modo Manutenção</p>
                  <p className="text-sm text-muted-foreground">
                    Ativar página de manutenção
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;