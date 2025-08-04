-- Inserir categorias de exemplo para o sistema
INSERT INTO public.categories (name, description, image_url, sort_order, is_featured) VALUES
('Relógios Clássicos', 'Elegância atemporal para todas as ocasiões', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', 1, true),
('Smartwatches', 'Tecnologia avançada no seu pulso', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800', 2, true),
('Relógios Esportivos', 'Resistência e funcionalidade para atletas', 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=800', 3, true),
('Relógios de Luxo', 'Peças exclusivas de alta relojoaria', 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800', 4, true),
('Relógios Femininos', 'Delicadeza e sofisticação', 'https://images.unsplash.com/photo-1511370235399-1802cae1d32f?w=800', 5, true),
('Relógios Vintage', 'Charme e história do passado', 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800', 6, false);