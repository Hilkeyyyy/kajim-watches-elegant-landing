-- Função segura para inserir/atualizar as configurações do site
CREATE OR REPLACE FUNCTION public.upsert_site_settings(new_settings jsonb)
RETURNS public.site_settings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
      editable_sections
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
      COALESCE(new_settings->'editable_sections', '{}'::jsonb)
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
      updated_at = now()
    WHERE s.id = v_id
    RETURNING * INTO v_row;
  END IF;

  RETURN v_row;
END;
$$;