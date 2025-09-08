# Guia de Segurança - KAJIM RELÓGIOS

## 📋 Status de Segurança Atual

### ✅ Implementado e Seguro
- **Autenticação unificada** via Supabase Auth com AuthContext
- **RLS (Row Level Security)** ativo em todas as tabelas críticas
- **Funções de verificação de permissão** (`is_admin`, `is_super_admin`)
- **Sanitização de HTML** contra ataques XSS
- **Busca parametrizada** contra injeção SQL
- **Logs de auditoria** para ações administrativas
- **Logs de segurança** para tentativas de acesso não autorizado

### ⚠️ Configurações Recomendadas do Supabase Auth

Acesse o painel do Supabase em: https://supabase.com/dashboard/project/nhzrqjlyaqxdjfnxuhht/auth/providers

#### Configurações Críticas:
1. **OTP Expiry Time**: Alterar de 86400s (24h) para 3600s (1h)
2. **Password Protection**: Habilitar "Leaked Password Protection"
3. **Rate Limiting**: Configurar limites para signup/signin
4. **Email Confirm**: Manter habilitado para produção

#### Configurações de Email:
- **Redirect URLs**: Adicionar domínios de produção
- **Site URL**: Configurar URL principal do site

### 🔒 Políticas RLS Implementadas

#### Tabela `profiles`
- Usuários só veem seus próprios perfis
- Admins podem ver todos os perfis
- Super admins têm acesso total

#### Tabela `products`
- Leitura pública para todos
- Modificação apenas para admins
- Super admins têm acesso total

#### Tabela `cart_items`
- Usuários só veem/modificam seus próprios itens
- Admins podem gerenciar todos os carrinhos

#### Tabela `security_audit_logs`
- Inserção para usuários autenticados
- Visualização apenas para super admins

## 🚨 Verificações de Segurança

### Checklist de Validação:
- [ ] Usuário comum não consegue acessar `/admin/*`
- [ ] Logs são gerados para tentativas de acesso não autorizado
- [ ] RLS está ativo em todas as tabelas
- [ ] Funções de verificação de permissão funcionam corretamente
- [ ] Sanitização de entrada está funcionando
- [ ] Rate limiting está configurado

### Testes de Penetração Básicos:
1. **Teste de Bypass de Admin**: Tentar acessar rotas admin sem permissão
2. **Teste de XSS**: Inserir scripts em campos de entrada
3. **Teste de SQL Injection**: Tentar injetar SQL na busca
4. **Teste de CSRF**: Verificar tokens de autenticação

## 🛡️ Monitoramento

### Logs de Segurança Monitorados:
- `unauthorized_admin_access_attempt` - Tentativas não autorizadas
- `suspicious_search_query` - Buscas suspeitas
- `xss_attempt_blocked` - Tentativas de XSS bloqueadas
- `role_update` - Alterações de permissão
- `admin_action` - Ações administrativas

### Métricas de Segurança:
- Acessar: `/admin/seguranca` para dashboard de segurança
- Logs em tempo real no Supabase Dashboard
- Alertas para atividades suspeitas

## 🔧 Manutenção

### Verificações Periódicas:
1. **Semanal**: Revisar logs de segurança
2. **Mensal**: Atualizar dependências
3. **Trimestral**: Revisar políticas RLS
4. **Anual**: Auditoria completa de segurança

### Atualizações Recomendadas:
- Supabase CLI sempre atualizado
- PostgreSQL versão 15+ (atualmente em 13.3)
- Dependências React/TypeScript atualizadas

## 📞 Contato de Segurança

Para reportar vulnerabilidades:
- Email: security@kajim.com.br
- Criar issue no repositório (para problemas não críticos)

---

**Última atualização**: Janeiro 2025
**Próxima revisão**: Abril 2025