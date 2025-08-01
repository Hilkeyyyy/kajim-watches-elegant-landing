-- Criar função para verificar se é o super administrador absoluto
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- UID específico com permissões absolutas de administração
  RETURN user_id = '51db7d6e-b382-44c9-b449-e0bbad743383'::uuid;
END;
$function$;

-- Atualizar função is_admin para incluir o super admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Verificar se é o super admin primeiro
  IF public.is_super_admin(user_id) THEN
    RETURN true;
  END IF;
  
  -- Verificar se é admin regular na tabela profiles
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
END;
$function$;

-- Garantir que o super admin tenha um perfil na tabela profiles
INSERT INTO public.profiles (user_id, name, role)
VALUES (
  '51db7d6e-b382-44c9-b449-e0bbad743383'::uuid,
  'Super Administrador',
  'admin'
)
ON CONFLICT (user_id) DO UPDATE SET
  name = 'Super Administrador',
  role = 'admin';

-- Criar políticas específicas para o super admin ter acesso absoluto
-- O super admin pode fazer qualquer operação em qualquer tabela

-- Política para produtos - super admin tem acesso total
DROP POLICY IF EXISTS "Super admin acesso total produtos" ON public.products;
CREATE POLICY "Super admin acesso total produtos"
ON public.products
FOR ALL
USING (public.is_super_admin(auth.uid()));

-- Política para categorias - super admin tem acesso total  
DROP POLICY IF EXISTS "Super admin acesso total categorias" ON public.categories;
CREATE POLICY "Super admin acesso total categorias"
ON public.categories
FOR ALL
USING (public.is_super_admin(auth.uid()));

-- Política para profiles - super admin pode gerenciar todos os perfis
DROP POLICY IF EXISTS "Super admin gerencia todos perfis" ON public.profiles;
CREATE POLICY "Super admin gerencia todos perfis"
ON public.profiles
FOR ALL
USING (public.is_super_admin(auth.uid()));