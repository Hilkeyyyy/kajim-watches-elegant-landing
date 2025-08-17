-- Fix failed migration: remove OLD from RLS, add trigger-based protection, and add audit logging

-- 1) Create audit_logs table (idempotent)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb DEFAULT '{}'::jsonb,
  new_values jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies: only super admin can read, authenticated can insert
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'Super admin can view audit logs'
  ) THEN
    CREATE POLICY "Super admin can view audit logs" ON public.audit_logs
      FOR SELECT TO authenticated
      USING (public.is_super_admin(auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'Authenticated can insert audit logs'
  ) THEN
    CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs
      FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- 2) Secure function to log admin actions (will insert into audit_logs)
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  table_name text,
  record_id uuid,
  details jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (action_type, table_name, record_id, new_values, user_id)
  VALUES (action_type, table_name, record_id, details, auth.uid());
END;
$$;

-- 3) Secure function to update user role (only super admin), with proper old/new logging
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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
$$;

-- 4) Remove overly permissive policy allowing admins to manage all profiles
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Admins podem gerenciar todos os perfis'
  ) THEN
    DROP POLICY "Admins podem gerenciar todos os perfis" ON public.profiles;
  END IF;
END $$;

-- Keep existing SELECT policies; block unauthorized role changes with a trigger instead of RLS OLD usage

-- 5) Trigger to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION public.prevent_role_updates() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Allow if super admin or role hasn't changed
  IF public.is_super_admin(auth.uid()) OR NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Unauthorized role update. Use update_user_role function.';
END;
$$;

DROP TRIGGER IF EXISTS prevent_unauthorized_role_updates ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION public.prevent_role_updates();

-- 6) Useful indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);
