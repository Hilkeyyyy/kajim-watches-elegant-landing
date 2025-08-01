-- Adicionar novos campos à tabela products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Adicionar novos campos à tabela categories para o carousel
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_visible ON public.products(is_visible) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON public.products(stock_status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);

-- Atualizar produtos existentes com valores padrão apropriados
UPDATE public.products 
SET stock_status = CASE 
  WHEN stock_quantity > 10 THEN 'in_stock'
  WHEN stock_quantity > 0 THEN 'low_stock' 
  ELSE 'out_of_stock'
END
WHERE stock_status IS NULL;

-- Definir algumas categorias como featured para o carousel
UPDATE public.categories 
SET is_featured = true, sort_order = 1 
WHERE name ILIKE '%relógio%' OR name ILIKE '%watch%'
LIMIT 1;

-- Definir alguns produtos como featured
UPDATE public.products 
SET is_featured = true
WHERE id IN (
  SELECT id FROM public.products 
  WHERE status = 'active' 
  ORDER BY created_at DESC 
  LIMIT 3
);