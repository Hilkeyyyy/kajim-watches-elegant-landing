-- Adicionar colunas para gerenciar categorias dinâmicas e mais configurações do site
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS layout_options jsonb DEFAULT '{
  "enable_search": true,
  "enable_category_auto_generation": true,
  "show_featured_section": true,
  "show_new_products_section": true,
  "show_offers_section": true,
  "show_brand_sections": true
}'::jsonb;

-- Criar tabela para gerenciar categorias/marcas customizadas
CREATE TABLE IF NOT EXISTS brand_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  custom_image_url text,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  auto_generated boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_categories_updated_at
  BEFORE UPDATE ON brand_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies para brand_categories
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorias de marca visíveis para todos" 
ON brand_categories FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem gerenciar categorias de marca" 
ON brand_categories FOR ALL 
USING (is_admin(auth.uid()));

-- Adicionar mais campos editáveis ao site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_background_image_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_watch_image_url text;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enable_hero_background_blur boolean DEFAULT true;

-- Adicionar seções editáveis como blocos de conteúdo
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS editable_sections jsonb DEFAULT '{
  "quality_badges": [
    {
      "id": "quality",
      "title": "Qualidade A++",
      "description": "Movimentos de alta precisão",
      "icon": "A++",
      "enabled": true
    },
    {
      "id": "warranty", 
      "title": "Garantia",
      "description": "Suporte completo e confiável",
      "icon": "🛡️",
      "enabled": true
    }
  ],
  "custom_blocks": []
}'::jsonb;