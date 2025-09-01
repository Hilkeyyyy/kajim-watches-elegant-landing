-- Criar políticas de storage para o bucket category-images se não existirem

-- Política para visualização pública das imagens de categoria
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'category-images' AND name = 'Public read access for category images'
  ) THEN
    CREATE POLICY "Public read access for category images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'category-images');
  END IF;
END $$;

-- Política para upload de imagens por admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'category-images' AND name = 'Admins can upload category images'
  ) THEN
    CREATE POLICY "Admins can upload category images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'category-images' AND is_admin(auth.uid()));
  END IF;
END $$;

-- Política para atualização de imagens por admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'category-images' AND name = 'Admins can update category images'
  ) THEN
    CREATE POLICY "Admins can update category images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'category-images' AND is_admin(auth.uid()));
  END IF;
END $$;

-- Política para exclusão de imagens por admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'category-images' AND name = 'Admins can delete category images'
  ) THEN
    CREATE POLICY "Admins can delete category images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'category-images' AND is_admin(auth.uid()));
  END IF;
END $$;