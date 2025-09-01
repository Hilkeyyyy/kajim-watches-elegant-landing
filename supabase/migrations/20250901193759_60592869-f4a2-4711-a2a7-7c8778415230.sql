-- Corrigir funções restantes com search_path mutable

-- Atualizar função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Atualizar função is_super_admin 
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- UID específico com permissões absolutas de administração
  RETURN user_id = '51db7d6e-b382-44c9-b449-e0bbad743383'::uuid;
END;
$function$;

-- Atualizar função is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

-- Atualizar função log_admin_action
CREATE OR REPLACE FUNCTION public.log_admin_action(action_type text, table_name text, record_id uuid, details jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.audit_logs (action_type, table_name, record_id, new_values, user_id)
  VALUES (action_type, table_name, record_id, details, auth.uid());
END;
$function$;

-- Atualizar função update_user_role
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_old_role text;
BEGIN
  -- Only super admin can update roles
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Only super administrators can update user roles';
  END IF;

  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Capture old role
  SELECT role INTO v_old_role FROM public.profiles WHERE user_id = target_user_id LIMIT 1;

  -- Update
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;

  -- Audit log
  PERFORM public.log_admin_action(
    'role_update',
    'profiles',
    target_user_id,
    jsonb_build_object('old_role', v_old_role, 'new_role', new_role)
  );

  RETURN true;
END;
$function$;