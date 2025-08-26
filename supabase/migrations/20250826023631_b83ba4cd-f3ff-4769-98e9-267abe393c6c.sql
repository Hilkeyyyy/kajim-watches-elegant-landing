-- Criar Edge Function para WhatsApp seguro
CREATE OR REPLACE FUNCTION public.generate_whatsapp_link(
  cart_data JSONB
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  formatted_message TEXT;
  cart_item JSONB;
  current_date TEXT;
  whatsapp_number TEXT := '5586988388124';
  total_value NUMERIC := 0;
BEGIN
  -- Validar entrada
  IF cart_data IS NULL OR jsonb_array_length(cart_data) = 0 THEN
    RAISE EXCEPTION 'Carrinho vazio';
  END IF;

  -- Formatar data atual
  current_date := to_char(now() AT TIME ZONE 'America/Fortaleza', 'DD/MM/YYYY HH24:MI');
  
  -- Construir mensagem
  formatted_message := 'Olá, gostaria de saber mais sobre estes produtos:' || E'\n\n';
  
  -- Processar cada item do carrinho
  FOR cart_item IN SELECT * FROM jsonb_array_elements(cart_data)
  LOOP
    formatted_message := formatted_message || 
      (cart_item->>'name') || E'\n' ||
      'Quantidade: ' || (cart_item->>'quantity') || E'\n' ||
      'Preço: ' || (cart_item->>'price') || E'\n';
      
    -- Calcular total (assumindo preços em formato "R$ X,XX")
    IF cart_item->>'total' IS NOT NULL THEN
      formatted_message := formatted_message || 'Total: ' || (cart_item->>'total') || E'\n';
    END IF;
    
    formatted_message := formatted_message || E'\n';
  END LOOP;
  
  formatted_message := formatted_message || 
    'Data/Hora do pedido: ' || current_date || E'\n\n' ||
    'Aguardo retorno para finalizar a compra!';
  
  -- Retornar link do WhatsApp
  RETURN 'https://wa.me/' || whatsapp_number || '?text=' || 
         replace(replace(replace(formatted_message, E'\n', '%0A'), ' ', '%20'), ':', '%3A');
END;
$$;