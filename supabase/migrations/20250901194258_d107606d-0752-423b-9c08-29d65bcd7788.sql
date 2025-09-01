-- Create a public view for site_settings with only display-safe fields
CREATE OR REPLACE VIEW public.site_settings_public AS
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

-- Update RLS policy to restrict direct table access to admins only
DROP POLICY IF EXISTS "Configurações do site são públicas" ON public.site_settings;

-- Create new restrictive policy for direct table access
CREATE POLICY "Site settings restricted to admins"
ON public.site_settings
FOR SELECT
USING (is_admin(auth.uid()));

-- Grant public access to the view
GRANT SELECT ON public.site_settings_public TO anon;
GRANT SELECT ON public.site_settings_public TO authenticated;