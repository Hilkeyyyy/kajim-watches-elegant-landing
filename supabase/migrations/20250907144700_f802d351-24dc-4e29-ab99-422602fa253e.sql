
-- 1) Atualiza a função para inserir/atualizar também social_links, footer_contact_info e footer_custom_links
CREATE OR REPLACE FUNCTION public.upsert_site_settings(new_settings jsonb)
RETURNS site_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_id uuid;
  v_row public.site_settings;
BEGIN
  -- Autorização: apenas admins podem chamar
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: only admins can update site settings';
  END IF;

  -- Tenta obter a única linha de configurações
  SELECT id INTO v_id FROM public.site_settings LIMIT 1;

  IF v_id IS NULL THEN
    INSERT INTO public.site_settings (
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
      editable_sections,
      social_links,
      footer_contact_info,
      footer_custom_links
    )
    VALUES (
      COALESCE(new_settings->>'site_title', 'KAJIM RELÓGIOS'),
      COALESCE(new_settings->>'hero_title', 'KAJIM RELÓGIOS'),
      COALESCE(new_settings->>'hero_subtitle', 'Precisão. Estilo. Exclusividade.'),
      new_settings->>'hero_image_url',
      new_settings->>'hero_background_image_url',
      new_settings->>'hero_watch_image_url',
      COALESCE((new_settings->>'enable_hero_background_blur')::boolean, true),
      COALESCE(new_settings->>'footer_text', 'KAJIM RELÓGIOS - Todos os direitos reservados.'),
      new_settings->>'about_text',
      new_settings->>'contact_info',
      new_settings->>'additional_info',
      COALESCE(new_settings->'hero_gallery', '[]'::jsonb),
      COALESCE(new_settings->'mid_banners', '[]'::jsonb),
      COALESCE((new_settings->>'show_mid_banners')::boolean, false),
      COALESCE(new_settings->'homepage_blocks', '[]'::jsonb),
      COALESCE(new_settings->'footer_links', '[]'::jsonb),
      COALESCE((new_settings->>'show_category_carousel')::boolean, true),
      COALESCE(new_settings->'layout_options', '{}'::jsonb),
      COALESCE(new_settings->'editable_sections', '{}'::jsonb),
      COALESCE(new_settings->'social_links', '{}'::jsonb),
      COALESCE(new_settings->'footer_contact_info', '{}'::jsonb),
      COALESCE(new_settings->'footer_custom_links', '[]'::jsonb)
    )
    RETURNING * INTO v_row;
  ELSE
    UPDATE public.site_settings s
    SET
      site_title = COALESCE(new_settings->>'site_title', s.site_title),
      hero_title = COALESCE(new_settings->>'hero_title', s.hero_title),
      hero_subtitle = COALESCE(new_settings->>'hero_subtitle', s.hero_subtitle),
      hero_image_url = COALESCE(new_settings->>'hero_image_url', s.hero_image_url),
      hero_background_image_url = COALESCE(new_settings->>'hero_background_image_url', s.hero_background_image_url),
      hero_watch_image_url = COALESCE(new_settings->>'hero_watch_image_url', s.hero_watch_image_url),
      enable_hero_background_blur = COALESCE((new_settings->>'enable_hero_background_blur')::boolean, s.enable_hero_background_blur),
      footer_text = COALESCE(new_settings->>'footer_text', s.footer_text),
      about_text = COALESCE(new_settings->>'about_text', s.about_text),
      contact_info = COALESCE(new_settings->>'contact_info', s.contact_info),
      additional_info = COALESCE(new_settings->>'additional_info', s.additional_info),
      hero_gallery = COALESCE(new_settings->'hero_gallery', s.hero_gallery),
      mid_banners = COALESCE(new_settings->'mid_banners', s.mid_banners),
      show_mid_banners = COALESCE((new_settings->>'show_mid_banners')::boolean, s.show_mid_banners),
      homepage_blocks = COALESCE(new_settings->'homepage_blocks', s.homepage_blocks),
      footer_links = COALESCE(new_settings->'footer_links', s.footer_links),
      show_category_carousel = COALESCE((new_settings->>'show_category_carousel')::boolean, s.show_category_carousel),
      layout_options = COALESCE(new_settings->'layout_options', s.layout_options),
      editable_sections = COALESCE(new_settings->'editable_sections', s.editable_sections),
      social_links = COALESCE(new_settings->'social_links', s.social_links),
      footer_contact_info = COALESCE(new_settings->'footer_contact_info', s.footer_contact_info),
      footer_custom_links = COALESCE(new_settings->'footer_custom_links', s.footer_custom_links),
      updated_at = now()
    WHERE s.id = v_id
    RETURNING * INTO v_row;
  END IF;

  RETURN v_row;
END;
$function$;

-- 2) Tornar o RPC público seguro completo para o rodapé (incluir novos campos)
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
  editable_sections jsonb,
  social_links jsonb,
  footer_contact_info jsonb,
  footer_custom_links jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
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
$function$;
