-- 1. Ensure site_settings has only one row (keep the latest if duplicates exist)
DELETE FROM public.site_settings 
WHERE id NOT IN (
  SELECT id FROM public.site_settings 
  ORDER BY updated_at DESC LIMIT 1
);

-- 2. Create content_blocks table for independent content sections
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  title text,
  subtitle text,
  body text,
  image_url text,
  extra jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Enable RLS on content_blocks
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for content_blocks
CREATE POLICY "Content blocks visible for everyone" 
ON public.content_blocks 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage content blocks" 
ON public.content_blocks 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 5. Create trigger for content_blocks updated_at
CREATE TRIGGER update_content_blocks_updated_at
BEFORE UPDATE ON public.content_blocks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create RPC function to get content block publicly
CREATE OR REPLACE FUNCTION public.get_content_block_public(p_content_key text)
RETURNS TABLE(
  content_key text,
  title text,
  subtitle text,
  body text,
  image_url text,
  extra jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    cb.content_key,
    cb.title,
    cb.subtitle,
    cb.body,
    cb.image_url,
    cb.extra
  FROM public.content_blocks cb
  WHERE cb.content_key = p_content_key
  LIMIT 1;
$$;

-- 7. Create RPC function to upsert content blocks (admin only)
CREATE OR REPLACE FUNCTION public.upsert_content_block(
  p_content_key text,
  data jsonb
)
RETURNS content_blocks
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_row public.content_blocks;
BEGIN
  -- Authorization: only admins can call
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: only admins can update content blocks';
  END IF;

  INSERT INTO public.content_blocks (
    content_key,
    title,
    subtitle,
    body,
    image_url,
    extra
  )
  VALUES (
    p_content_key,
    data->>'title',
    data->>'subtitle',
    data->>'body',
    data->>'image_url',
    COALESCE(data->'extra', '{}'::jsonb)
  )
  ON CONFLICT (content_key) 
  DO UPDATE SET
    title = COALESCE(data->>'title', content_blocks.title),
    subtitle = COALESCE(data->>'subtitle', content_blocks.subtitle),
    body = COALESCE(data->>'body', content_blocks.body),
    image_url = COALESCE(data->>'image_url', content_blocks.image_url),
    extra = COALESCE(data->'extra', content_blocks.extra),
    updated_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

-- 8. Seed initial about_section content block if it doesn't exist
INSERT INTO public.content_blocks (content_key, title, body)
VALUES (
  'about_section',
  'Sobre KAJIM',
  'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.'
)
ON CONFLICT (content_key) DO NOTHING;