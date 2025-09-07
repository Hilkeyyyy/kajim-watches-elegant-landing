-- Criar função RPC otimizada que retorna JSON estruturado
CREATE OR REPLACE FUNCTION public.search_products_json(search_term text, result_limit integer DEFAULT 8)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  sanitized_term text;
  results jsonb;
BEGIN
  -- Sanitizar termo
  sanitized_term := trim(regexp_replace(search_term, '[^\w\s\-\.]', '', 'g'));
  IF length(sanitized_term) < 2 THEN 
    RETURN '[]'::jsonb; 
  END IF;
  IF result_limit IS NULL OR result_limit < 1 OR result_limit > 100 THEN 
    result_limit := 8; 
  END IF;

  -- Buscar produtos e montar JSON estruturado
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', p.id,
      'name', p.name,
      'brand', p.brand,
      'description', COALESCE(p.description, ''),
      'price', p.price::text,
      'original_price', COALESCE(p.original_price::text, p.price::text),
      'image', p.image_url,
      'images', COALESCE(p.images, ARRAY[]::text[]),
      'features', COALESCE(p.features, ARRAY[]::text[]),
      'status', COALESCE(p.status::text, 'active'),
      'created_at', p.created_at::text,
      'updated_at', p.updated_at::text
    )
  ) INTO results
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

  RETURN COALESCE(results, '[]'::jsonb);
END;
$function$