-- Primeiro drop a função existente
DROP FUNCTION IF EXISTS public.get_site_settings_public();

-- Recriar com novos campos
CREATE OR REPLACE FUNCTION public.get_site_settings_public()
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
   contact_info text, 
   additional_info text, 
   hero_gallery jsonb, 
   mid_banners jsonb, 
   show_mid_banners boolean, 
   homepage_blocks jsonb, 
   footer_links jsonb, 
   show_category_carousel boolean, 
   layout_options jsonb, 
   editable_sections jsonb,
   social_links jsonb,
   footer_contact_info jsonb,
   footer_custom_links jsonb
 )
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
    s.editable_sections,
    s.social_links,
    s.footer_contact_info,
    s.footer_custom_links
  FROM public.site_settings s
  LIMIT 1;
$function$