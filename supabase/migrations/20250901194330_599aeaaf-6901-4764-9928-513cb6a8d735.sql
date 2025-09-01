-- Fix the security definer view by recreating it without SECURITY DEFINER
DROP VIEW IF EXISTS public.site_settings_public;

-- Create the view without SECURITY DEFINER (uses invoker rights by default)
CREATE VIEW public.site_settings_public AS
SELECT 
  site_title,
  hero_title,
  hero_subtitle,
  hero_image_url,
  hero_background_image_url,
  hero_watch_image_url,
  enable_hero_background_blur,
  footer_text,
  about_text,
  contact_info,
  additional_info,
  hero_gallery,
  mid_banners,
  show_mid_banners,
  homepage_blocks,
  footer_links,
  show_category_carousel,
  layout_options,
  editable_sections
FROM public.site_settings
LIMIT 1;

-- Grant access to the view for all users
GRANT SELECT ON public.site_settings_public TO anon;
GRANT SELECT ON public.site_settings_public TO authenticated;