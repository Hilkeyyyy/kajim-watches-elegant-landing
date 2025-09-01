-- Alternative approach: Use a function instead of a view to avoid security definer issues
DROP VIEW IF EXISTS public.site_settings_public;

-- Create a function that returns site settings data for public consumption
CREATE OR REPLACE FUNCTION public.get_site_settings_public()
RETURNS TABLE (
  site_title TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  hero_background_image_url TEXT,
  hero_watch_image_url TEXT,
  enable_hero_background_blur BOOLEAN,
  footer_text TEXT,
  about_text TEXT,
  contact_info TEXT,
  additional_info TEXT,
  hero_gallery JSONB,
  mid_banners JSONB,
  show_mid_banners BOOLEAN,
  homepage_blocks JSONB,
  footer_links JSONB,
  show_category_carousel BOOLEAN,
  layout_options JSONB,
  editable_sections JSONB
)
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = ''
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
    s.contact_info,
    s.additional_info,
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_site_settings_public() TO anon;
GRANT EXECUTE ON FUNCTION public.get_site_settings_public() TO authenticated;