-- Enhanced Security: Restrict audit log permissions and improve RLS policies

-- Update security_audit_logs RLS policies to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can insert security logs" ON public.security_audit_logs;

-- Only allow inserts through security functions, not direct user inserts
CREATE POLICY "System functions can insert security logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from authenticated users through our security functions
  auth.uid() IS NOT NULL AND 
  current_setting('app.inserting_security_log', true) = 'true'
);

-- Update audit_logs RLS policies to be more restrictive  
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;

CREATE POLICY "System functions can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from authenticated users through our admin functions
  auth.uid() IS NOT NULL AND 
  current_setting('app.inserting_audit_log', true) = 'true'
);

-- Create enhanced security function that sets the proper context
CREATE OR REPLACE FUNCTION public.log_security_event_enhanced(
  p_event_type text, 
  p_details jsonb DEFAULT '{}'::jsonb, 
  p_severity text DEFAULT 'medium'::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Set configuration to allow insert
  PERFORM set_config('app.inserting_security_log', 'true', true);
  
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    details,
    severity,
    ip_address,
    user_agent
  )
  VALUES (
    p_event_type,
    auth.uid(),
    p_details,
    p_severity,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  -- Reset configuration
  PERFORM set_config('app.inserting_security_log', 'false', true);
END;
$function$;

-- Create enhanced admin action logging function
CREATE OR REPLACE FUNCTION public.log_admin_action_enhanced(
  action_type text, 
  table_name text, 
  record_id uuid, 
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Set configuration to allow insert
  PERFORM set_config('app.inserting_audit_log', 'true', true);
  
  INSERT INTO public.audit_logs (
    action_type, 
    table_name, 
    record_id, 
    new_values, 
    user_id,
    ip_address,
    user_agent
  )
  VALUES (
    action_type, 
    table_name, 
    record_id, 
    details, 
    auth.uid(),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  -- Reset configuration
  PERFORM set_config('app.inserting_audit_log', 'false', true);
END;
$function$;

-- Add rate limiting table for authentication attempts
CREATE TABLE IF NOT EXISTS public.auth_rate_limit (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address inet NOT NULL,
  attempt_type text NOT NULL, -- 'login', 'signup', 'password_reset'
  attempts_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limiting table
ALTER TABLE public.auth_rate_limit ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_auth_rate_limit_ip_type ON public.auth_rate_limit(ip_address, attempt_type);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limit_window ON public.auth_rate_limit(window_start);

-- Only super admins can view rate limiting data
CREATE POLICY "Super admins can view auth rate limits" 
ON public.auth_rate_limit 
FOR SELECT 
USING (is_super_admin(auth.uid()));

-- System can insert rate limit data
CREATE POLICY "System can manage rate limits" 
ON public.auth_rate_limit 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_auth_rate_limit_updated_at
BEFORE UPDATE ON public.auth_rate_limit
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();