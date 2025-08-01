-- Remove category_id from products table and add extensive watch specifications
ALTER TABLE public.products DROP COLUMN IF EXISTS category_id;

-- Add extensive watch specifications
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS watch_type TEXT; -- Dress, Sport, Diving, Racing, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bezel_type TEXT; -- Fixed, Rotating, Tachymeter, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS glass_type TEXT; -- Sapphire, Mineral, Acrylic
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS clasp_type TEXT; -- Folding, Deployment, Pin buckle, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS certification TEXT; -- COSC, METAS, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS power_reserve TEXT; -- Hours of power reserve
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS complications TEXT[]; -- GMT, Chronograph, Date, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dial_color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS strap_material TEXT; -- Leather, Steel, Rubber, etc.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight TEXT; -- Weight in grams
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS thickness TEXT; -- Thickness in mm
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS lug_width TEXT; -- Lug width in mm
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS country_origin TEXT; -- Swiss Made, Japanese, etc.

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Users can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);