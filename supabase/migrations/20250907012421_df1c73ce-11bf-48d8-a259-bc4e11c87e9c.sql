-- Criar função de busca segura e otimizada
CREATE OR REPLACE FUNCTION search_products_secure(
  search_term TEXT,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  brand TEXT,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  images TEXT[],
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validar parâmetros de entrada
  IF search_term IS NULL OR LENGTH(TRIM(search_term)) < 1 THEN
    RETURN;
  END IF;
  
  IF result_limit IS NULL OR result_limit < 1 OR result_limit > 100 THEN
    result_limit := 10;
  END IF;
  
  -- Busca otimizada com índices e relevância
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.brand,
    p.description,
    p.price,
    p.image_url,
    p.images,
    p.created_at
  FROM products p
  WHERE 
    p.is_visible = true 
    AND p.status = 'active'
    AND (
      -- Busca por nome (maior peso)
      LOWER(p.name) ILIKE '%' || LOWER(TRIM(search_term)) || '%'
      OR 
      -- Busca por marca (alto peso)
      LOWER(p.brand) ILIKE '%' || LOWER(TRIM(search_term)) || '%'
      OR
      -- Busca por descrição (menor peso)
      LOWER(p.description) ILIKE '%' || LOWER(TRIM(search_term)) || '%'
      OR
      -- Busca por collection
      LOWER(p.collection) ILIKE '%' || LOWER(TRIM(search_term)) || '%'
      OR
      -- Busca em arrays de badges
      EXISTS (
        SELECT 1 FROM unnest(p.badges) AS badge
        WHERE LOWER(badge) ILIKE '%' || LOWER(TRIM(search_term)) || '%'
      )
    )
  ORDER BY 
    -- Ordenação por relevância
    CASE 
      WHEN LOWER(p.name) ILIKE LOWER(TRIM(search_term)) || '%' THEN 1
      WHEN LOWER(p.brand) ILIKE LOWER(TRIM(search_term)) || '%' THEN 2
      WHEN LOWER(p.name) ILIKE '%' || LOWER(TRIM(search_term)) || '%' THEN 3
      WHEN LOWER(p.brand) ILIKE '%' || LOWER(TRIM(search_term)) || '%' THEN 4
      ELSE 5
    END,
    -- Ordenação secundária por produtos em destaque e data
    p.is_featured DESC,
    p.created_at DESC
  LIMIT result_limit;
END;
$$;

-- Criar índices para otimizar as buscas
CREATE INDEX IF NOT EXISTS idx_products_search_name ON products USING GIN (to_tsvector('portuguese', name));
CREATE INDEX IF NOT EXISTS idx_products_search_brand ON products USING GIN (to_tsvector('portuguese', brand));
CREATE INDEX IF NOT EXISTS idx_products_search_description ON products USING GIN (to_tsvector('portuguese', description));
CREATE INDEX IF NOT EXISTS idx_products_visible_status ON products (is_visible, status) WHERE is_visible = true AND status = 'active';
CREATE INDEX IF NOT EXISTS idx_products_featured_created ON products (is_featured DESC, created_at DESC);

-- Comentário de documentação
COMMENT ON FUNCTION search_products_secure IS 'Função segura para busca de produtos com validação de entrada e otimização de performance';