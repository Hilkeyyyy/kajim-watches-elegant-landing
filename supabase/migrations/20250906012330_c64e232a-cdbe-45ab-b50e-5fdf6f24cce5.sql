-- Security Fix Phase 1: Site Settings Data Exposure & RLS Improvements

-- 1. Create a secure public function that only exposes non-sensitive site data
CREATE OR REPLACE FUNCTION public.get_site_settings_public_secure()
RETURNS TABLE(
  site_title text,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  hero_background_image_url text,
  hero_watch_image_url text,
  enable_hero_background_blur boolean,
  footer_text text,
  about_text text,
  hero_gallery jsonb,
  mid_banners jsonb,
  show_mid_banners boolean,
  homepage_blocks jsonb,
  footer_links jsonb,
  show_category_carousel boolean,
  layout_options jsonb,
  editable_sections jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    s.site_title,
    s.hero_title,
    s.hero_subtitle,
    s.hero_image_url,
    s.hero_background_image_url,
    s.hero_watch_image_url,
    s.enable_hero_background_blur,
    s.footer_text,
    s.about_text,
    s.hero_gallery,
    s.mid_banners,
    s.show_mid_banners,
    s.homepage_blocks,
    s.footer_links,
    s.show_category_carousel,
    s.layout_options,
    s.editable_sections
  FROM public.site_settings s
  LIMIT 1;
$$;

-- 2. Create enhanced audit logging for security events
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on security audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Security audit logs policies
CREATE POLICY "Super admins can view security logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (is_super_admin(auth.uid()));

CREATE POLICY "Authenticated users can insert security logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Create function to log security events to database
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_severity text DEFAULT 'medium'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    details,
    severity
  )
  VALUES (
    p_event_type,
    auth.uid(),
    p_details,
    p_severity
  );
END;
$$;

-- 4. Create secure search function to prevent SQL injection
CREATE OR REPLACE FUNCTION public.search_products_secure(
  search_term text,
  result_limit integer DEFAULT 8
)
RETURNS TABLE(
  id uuid,
  name text,
  brand text,
  description text,
  price numeric,
  image_url text,
  images text[],
  created_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  sanitized_term text;
BEGIN
  -- Log search attempt
  PERFORM log_security_event('product_search', jsonb_build_object('term', search_term));
  
  -- Sanitize search term to prevent injection
  sanitized_term := trim(regexp_replace(search_term, '[^\w\s\-\.]', '', 'g'));
  
  -- Return empty if term is too short or empty after sanitization
  IF length(sanitized_term) < 2 THEN
    RETURN;
  END IF;
  
  -- Use proper text search with sanitized term
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.description,
    p.price,
    p.image_url,
    p.images,
    p.created_at
  FROM public.products p
  WHERE 
    p.is_visible = true 
    AND p.status = 'active'
    AND (
      p.name ILIKE '%' || sanitized_term || '%' OR
      p.brand ILIKE '%' || sanitized_term || '%' OR
      p.description ILIKE '%' || sanitized_term || '%'
    )
  ORDER BY p.created_at DESC
  LIMIT result_limit;
END;
$$;

-- 5. Enhanced role update logging
CREATE OR REPLACE FUNCTION public.update_user_role_secure(target_user_id uuid, new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_old_role text;
  v_caller_id uuid;
BEGIN
  v_caller_id := auth.uid();
  
  -- Only super admin can update roles
  IF NOT public.is_super_admin(v_caller_id) THEN
    -- Log unauthorized attempt
    PERFORM log_security_event(
      'unauthorized_role_change_attempt',
      jsonb_build_object(
        'target_user_id', target_user_id,
        'attempted_role', new_role,
        'caller_id', v_caller_id
      ),
      'high'
    );
    RAISE EXCEPTION 'Unauthorized: Only super administrators can update user roles';
  END IF;

  -- Validate role
  IF new_role NOT IN ('user', 'admin') THEN
    PERFORM log_security_event(
      'invalid_role_attempt',
      jsonb_build_object('attempted_role', new_role),
      'medium'
    );
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Capture old role
  SELECT role INTO v_old_role FROM public.profiles WHERE user_id = target_user_id LIMIT 1;

  -- Update role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE user_id = target_user_id;

  -- Log successful role change
  PERFORM log_security_event(
    'role_updated',
    jsonb_build_object(
      'target_user_id', target_user_id,
      'old_role', v_old_role,
      'new_role', new_role,
      'caller_id', v_caller_id
    ),
    'high'
  );

  -- Also log to existing audit_logs for backward compatibility
  PERFORM public.log_admin_action(
    'role_update',
    'profiles',
    target_user_id,
    jsonb_build_object('old_role', v_old_role, 'new_role', new_role)
  );

  RETURN true;
END;
$$;