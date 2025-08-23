-- Expand site_settings table for flexible site editing
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS hero_gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mid_banners jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS show_mid_banners boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS homepage_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS show_category_carousel boolean NOT NULL DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN public.site_settings.hero_gallery IS 'Array of hero images with URLs and metadata';
COMMENT ON COLUMN public.site_settings.mid_banners IS 'Array of banner objects for middle page sections';
COMMENT ON COLUMN public.site_settings.show_mid_banners IS 'Toggle to show/hide mid-page banners';
COMMENT ON COLUMN public.site_settings.homepage_blocks IS 'Array of configurable homepage content blocks';
COMMENT ON COLUMN public.site_settings.footer_links IS 'Array of footer link objects';
COMMENT ON COLUMN public.site_settings.show_category_carousel IS 'Toggle to show/hide category carousel';