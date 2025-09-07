-- Atualizar função de busca para considerar apenas nome, marca e descrição
CREATE OR REPLACE FUNCTION search_products_secure(search_term text, result_limit integer DEFAULT 8)
 RETURNS TABLE(id uuid, name text, brand text, description text, price numeric, image_url text, images text[], created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $$
DECLARE
  sanitized_term text;
BEGIN
  -- Sanitizar termo
  sanitized_term := trim(regexp_replace(search_term, '[^\w\s\-\.]', '', 'g'));
  IF length(sanitized_term) < 2 THEN RETURN; END IF;
  IF result_limit IS NULL OR result_limit < 1 OR result_limit > 100 THEN result_limit := 8; END IF;

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
      p.name ILIKE '%' || sanitized_term || '%'
      OR p.brand ILIKE '%' || sanitized_term || '%'
      OR p.description ILIKE '%' || sanitized_term || '%'
    )
  ORDER BY 
    CASE 
      WHEN LOWER(p.name) ILIKE LOWER(sanitized_term) || '%' THEN 1
      WHEN LOWER(p.brand) ILIKE LOWER(sanitized_term) || '%' THEN 2
      WHEN LOWER(p.name) ILIKE '%' || LOWER(sanitized_term) || '%' THEN 3
      WHEN LOWER(p.brand) ILIKE '%' || LOWER(sanitized_term) || '%' THEN 4
      ELSE 5
    END,
    p.is_featured DESC,
    p.created_at DESC
  LIMIT result_limit;
END;
$$;