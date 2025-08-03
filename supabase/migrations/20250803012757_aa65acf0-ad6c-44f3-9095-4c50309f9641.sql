-- Add sample products with correct badge structure using uppercase badges like existing data
INSERT INTO public.products (
  name, brand, price, description, image_url, images, badges, features, 
  is_visible, is_featured, status, stock_quantity, stock_status
) VALUES 
(
  'Rolex Submariner Collection', 
  'Rolex', 
  12000.00, 
  'Relógio de mergulho icônico da Rolex com resistência à água de 300m.',
  'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800',
  ARRAY['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'],
  ARRAY['DESTAQUE', 'NOVIDADE'],
  ARRAY['Resistente à água', 'Movimento automático', 'Caixa em aço'],
  true, true, 'active', 5, 'in_stock'
),
(
  'Omega Speedmaster Professional', 
  'Omega', 
  8500.00, 
  'O lendário relógio que foi à lua. Cronógrafo profissional.',
  'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800',
  ARRAY['https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=800'],
  ARRAY['OFERTA', 'DESTAQUE'],
  ARRAY['Cronógrafo', 'Movimento manual', 'Vidro safira'],
  true, true, 'active', 3, 'in_stock'
),
(
  'TAG Heuer Formula 1 Racing', 
  'TAG Heuer', 
  2800.00, 
  'Relógio esportivo inspirado na Fórmula 1 com cronógrafo de alta precisão.',
  'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=800',
  ARRAY['https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=800'],
  ARRAY['NOVIDADE'],
  ARRAY['Cronógrafo', 'Resistente à água', 'Design esportivo'],
  true, false, 'active', 8, 'in_stock'
),
(
  'Cartier Santos Limited Edition', 
  'Cartier', 
  15000.00, 
  'Edição limitada do clássico Santos com apenas 500 unidades produzidas.',
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800',
  ARRAY['https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800'],
  ARRAY['LIMITADO'],
  ARRAY['Edição limitada', 'Ouro 18k', 'Movimento manufatura'],
  true, false, 'active', 1, 'in_stock'
),
(
  'Breitling Navitimer Vintage', 
  'Breitling', 
  4200.00, 
  'Relógio vintage esgotado, item de colecionador muito procurado.',
  'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800',
  ARRAY['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800'],
  ARRAY['LIMITADO'],
  ARRAY['Vintage', 'Cronógrafo', 'Régua de cálculo'],
  true, false, 'active', 0, 'out_of_stock'
),
(
  'Seiko Prospex Solar Diver', 
  'Seiko', 
  890.00, 
  'Relógio solar com excelente custo-benefício em promoção especial.',
  'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
  ARRAY['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'],
  ARRAY['OFERTA'],
  ARRAY['Energia solar', 'Resistente à água', 'Display analógico'],
  true, false, 'active', 12, 'in_stock'
);