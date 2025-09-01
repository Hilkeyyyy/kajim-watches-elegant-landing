-- Atualizar função is_super_admin para incluir o novo superadministrador
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- UIDs específicos com permissões absolutas de administração
  RETURN user_id IN (
    '51db7d6e-b382-44c9-b449-e0bbad743383'::uuid,
    'cc239ac0-2567-4b77-befd-1e9f5873c7cf'::uuid
  );
END;
$function$;