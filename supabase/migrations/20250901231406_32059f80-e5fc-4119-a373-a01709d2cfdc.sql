-- Criar políticas de storage para o bucket category-images

-- Política para visualização pública das imagens de categoria
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

-- Política para upload de imagens por admins
CREATE POLICY "Admins can upload category images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'category-images' AND is_admin(auth.uid()));

-- Política para atualização de imagens por admins
CREATE POLICY "Admins can update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images' AND is_admin(auth.uid()));

-- Política para exclusão de imagens por admins
CREATE POLICY "Admins can delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images' AND is_admin(auth.uid()));