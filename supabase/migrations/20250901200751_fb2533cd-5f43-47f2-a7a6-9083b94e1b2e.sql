-- FASE 1: Migração de dados da tabela categories para brand_categories

-- Primeiro, inserir todas as categorias manuais existentes em brand_categories
INSERT INTO public.brand_categories (
  brand_name,
  display_name,
  description,
  custom_image_url,
  sort_order,
  is_featured,
  is_visible,
  auto_generated
)
SELECT 
  name as brand_name,
  name as display_name,
  description,
  image_url as custom_image_url,
  COALESCE(sort_order, 0) as sort_order,
  COALESCE(is_featured, false) as is_featured,
  true as is_visible,
  false as auto_generated -- Marcar como criadas manualmente
FROM public.categories
WHERE NOT EXISTS (
  SELECT 1 FROM public.brand_categories bc 
  WHERE bc.brand_name = categories.name
);

-- Atualizar categorias automáticas existentes para serem editáveis
UPDATE public.brand_categories 
SET 
  is_visible = true,
  updated_at = now()
WHERE auto_generated = true;

-- Remover a tabela categories após migração bem-sucedida
DROP TABLE IF EXISTS public.categories;