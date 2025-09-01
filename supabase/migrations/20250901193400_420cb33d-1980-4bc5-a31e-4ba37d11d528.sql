-- FASE 1: Corrigir Escalação Crítica de Privilégios
-- Remover políticas permissivas atuais e adicionar proteções rigorosas

-- 1. Primeiro, vamos criar uma nova política mais restritiva para profiles
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;

-- 2. Criar política que permite apenas atualizações de campos não sensíveis
CREATE POLICY "Usuários podem atualizar dados básicos do próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND OLD.role IS NOT DISTINCT FROM NEW.role  -- Impede mudança de role
  AND OLD.user_id IS NOT DISTINCT FROM NEW.user_id  -- Impede mudança de user_id
);

-- 3. Criar trigger para prevenir atualizações diretas de role
CREATE OR REPLACE FUNCTION public.prevent_direct_role_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Permitir se for super admin ou se role não mudou
  IF public.is_super_admin(auth.uid()) OR NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;
  
  -- Log da tentativa de alteração não autorizada
  PERFORM public.log_admin_action(
    'unauthorized_role_change_attempt',
    'profiles',
    NEW.user_id,
    jsonb_build_object('attempted_role', NEW.role, 'current_role', OLD.role)
  );
  
  RAISE EXCEPTION 'Alteração de role não autorizada. Use a função update_user_role().';
END;
$function$;

-- 4. Adicionar trigger para prevenir alterações diretas de role
DROP TRIGGER IF EXISTS prevent_direct_role_updates_trigger ON public.profiles;
CREATE TRIGGER prevent_direct_role_updates_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_direct_role_updates();

-- FASE 2: Melhorias de Segurança no Banco de Dados
-- Corrigir funções com problemas de segurança

-- 1. Atualizar função handle_new_user com search_path seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$function$;

-- 2. Atualizar função generate_whatsapp_link com search_path seguro
CREATE OR REPLACE FUNCTION public.generate_whatsapp_link(cart_data jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  formatted_message TEXT;
  cart_item JSONB;
  formatted_date TEXT;
  whatsapp_number TEXT := '559181993435';
BEGIN
  -- Validar entrada
  IF cart_data IS NULL OR jsonb_array_length(cart_data) = 0 THEN
    RAISE EXCEPTION 'Carrinho vazio';
  END IF;

  -- Formatar data atual
  formatted_date := to_char(now() AT TIME ZONE 'America/Fortaleza', 'DD/MM/YYYY HH24:MI');
  
  -- Construir mensagem
  formatted_message := 'Olá, gostaria de saber mais sobre estes produtos:' || E'\n\n';
  
  -- Processar cada item do carrinho
  FOR cart_item IN SELECT * FROM jsonb_array_elements(cart_data)
  LOOP
    formatted_message := formatted_message || 
      (cart_item->>'name') || E'\n' ||
      'Quantidade: ' || (cart_item->>'quantity') || E'\n' ||
      'Preço: ' || (cart_item->>'price') || E'\n';
      
    IF cart_item->>'total' IS NOT NULL THEN
      formatted_message := formatted_message || 'Total: ' || (cart_item->>'total') || E'\n';
    END IF;
    
    formatted_message := formatted_message || E'\n';
  END LOOP;
  
  formatted_message := formatted_message || 
    'Data/Hora do pedido: ' || formatted_date || E'\n\n' ||
    'Aguardo retorno para finalizar a compra!';
  
  -- Retornar link do WhatsApp
  RETURN 'https://wa.me/' || whatsapp_number || '?text=' || 
         replace(replace(replace(formatted_message, E'\n', '%0A'), ' ', '%20'), ':', '%3A');
END;
$function$;

-- FASE 3: Políticas de Auditoria Mais Rigorosas
-- Restringir ainda mais o acesso aos logs de auditoria

DROP POLICY IF EXISTS "Super admin can view audit logs" ON public.audit_logs;
CREATE POLICY "Super admin can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (
  public.is_super_admin(auth.uid()) 
  AND created_at >= now() - interval '30 days'  -- Limitar a logs dos últimos 30 dias
);

-- 4. Adicionar política para prevenir inserções maliciosas em audit_logs
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()  -- Garantir que user_id corresponde ao usuário autenticado
);