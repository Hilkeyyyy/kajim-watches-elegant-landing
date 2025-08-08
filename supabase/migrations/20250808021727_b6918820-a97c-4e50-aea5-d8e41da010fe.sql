
-- Add original (old) price to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS original_price numeric NULL;
