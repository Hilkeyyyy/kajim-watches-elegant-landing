-- Corrigir função de busca removendo log que causa erro de transação read-only
CREATE OR REPLACE FUNCTION search_products_secure(search_term text, result_limit integer DEFAULT 8)
 RETURNS TABLE(id uuid, name text, brand text, description text, price numeric, image_url text, images text[], created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $$
DECLARE
  sanitized_term text;
BEGIN
  -- Sanitize search term to prevent injection
  sanitized_term := trim(regexp_replace(search_term, '[^\w\s\-\.]', '', 'g'));
  
  -- Return empty if term is too short or empty after sanitization
  IF length(sanitized_term) < 2 THEN
    RETURN;
  END IF;
  
  -- Validar limite
  IF result_limit IS NULL OR result_limit < 1 OR result_limit > 100 THEN
    result_limit := 8;
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
  FROM public.products p
  WHERE 
    p.is_visible = true 
    AND p.status = 'active'
    AND (
      -- Busca por nome (maior peso)
      LOWER(p.name) ILIKE '%' || LOWER(sanitized_term) || '%'
      OR 
      -- Busca por marca (alto peso)
      LOWER(p.brand) ILIKE '%' || LOWER(sanitized_term) || '%'
      OR
      -- Busca por descrição (menor peso)
      LOWER(p.description) ILIKE '%' || LOWER(sanitized_term) || '%'
      OR
      -- Busca por collection
      LOWER(p.collection) ILIKE '%' || LOWER(sanitized_term) || '%'
      OR
      -- Busca em custom_tags
      EXISTS (
        SELECT 1 FROM unnest(p.custom_tags) AS tag
        WHERE LOWER(tag) ILIKE '%' || LOWER(sanitized_term) || '%'
      )
      OR
      -- Busca em arrays de badges
      EXISTS (
        SELECT 1 FROM unnest(p.badges) AS badge
        WHERE LOWER(badge) ILIKE '%' || LOWER(sanitized_term) || '%'
      )
    )
  ORDER BY 
    -- Ordenação por relevância
    CASE 
      WHEN LOWER(p.name) ILIKE LOWER(sanitized_term) || '%' THEN 1
      WHEN LOWER(p.brand) ILIKE LOWER(sanitized_term) || '%' THEN 2
      WHEN LOWER(p.name) ILIKE '%' || LOWER(sanitized_term) || '%' THEN 3
      WHEN LOWER(p.brand) ILIKE '%' || LOWER(sanitized_term) || '%' THEN 4
      ELSE 5
    END,
    -- Ordenação secundária por produtos em destaque e data
    p.is_featured DESC,
    p.created_at DESC
  LIMIT result_limit;
END;
$$;