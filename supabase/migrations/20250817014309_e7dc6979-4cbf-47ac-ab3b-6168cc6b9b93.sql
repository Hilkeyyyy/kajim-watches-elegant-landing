-- Phase 1: Critical Security Fixes - Secure Role Management

-- First, create a secure function for role updates that only super admins can use
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only super admin can update roles
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Only super administrators can update user roles';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;
  
  -- Update the role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Log the role change
  INSERT INTO public.audit_logs (
    action_type,
    table_name,
    record_id,
    old_values,
    new_values,
    user_id
  ) VALUES (
    'role_update',
    'profiles',
    target_user_id,
    jsonb_build_object('role', (SELECT role FROM public.profiles WHERE user_id = target_user_id LIMIT 1)),
    jsonb_build_object('role', new_role),
    auth.uid()
  );
  
  RETURN true;
END;
$$;

-- Create audit logs table for security monitoring
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
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admin can view audit logs
CREATE POLICY "Super admin can view audit logs" ON public.audit_logs
  FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);

-- Add more restrictive RLS policies for profiles role updates
DROP POLICY IF EXISTS "Admins podem gerenciar todos os perfis" ON public.profiles;

-- Create new, more restrictive policies
CREATE POLICY "Super admin can manage all profiles" ON public.profiles
  FOR ALL
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can view profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Regular users can only update their own profile (excluding role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND role = OLD.role -- Prevent role changes
  );

-- Prevent any direct role updates except through the secure function
CREATE OR REPLACE FUNCTION public.prevent_role_updates() RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Allow if it's the super admin or if role hasn't changed
  IF public.is_super_admin(auth.uid()) OR NEW.role = OLD.role THEN
    RETURN NEW;
  END IF;
  
  -- Block unauthorized role changes
  RAISE EXCEPTION 'Unauthorized role update. Use update_user_role function.';
END;
$$;

-- Create trigger to prevent unauthorized role updates
DROP TRIGGER IF EXISTS prevent_unauthorized_role_updates ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION public.prevent_role_updates();

-- Create function to log admin actions
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
  INSERT INTO public.audit_logs (
    action_type,
    table_name,
    record_id,
    new_values,
    user_id
  ) VALUES (
    action_type,
    table_name,
    record_id,
    details,
    auth.uid()
  );
END;
$$;