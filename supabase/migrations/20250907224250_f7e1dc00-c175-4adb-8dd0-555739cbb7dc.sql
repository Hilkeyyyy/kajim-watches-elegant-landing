-- Atualizar marcas existentes para MAIÚSCULO
UPDATE brand_categories SET 
    display_name = UPPER(brand_name),
    updated_at = now()
WHERE brand_name IN ('hamilton', 'Hamilton', 'seiko', 'Seiko', 'baltic', 'Baltic', 'citizen', 'Citizen', 'tag heuer', 'Tag Heuer', 'TAG Heuer', 'bulova', 'Bulova', 'venezianico', 'Venezianico');

-- Inserir marcas que não existem ainda (usando INSERT ... ON CONFLICT)
INSERT INTO brand_categories (brand_name, display_name, description, is_visible, is_featured, sort_order, auto_generated)
VALUES 
    ('Hamilton', 'HAMILTON', 'Relógios americanos com tradição militar e aviação', true, true, 1, false),
    ('Seiko', 'SEIKO', 'Inovação japonesa em relojoaria desde 1881', true, true, 2, false),
    ('Baltic', 'BALTIC', 'Relógios franceses com design vintage contemporâneo', true, true, 3, false),
    ('Citizen', 'CITIZEN', 'Tecnologia Eco-Drive e precisão japonesa', true, true, 4, false),
    ('TAG Heuer', 'TAG HEUER', 'Cronógrafos suíços para esportes e luxo', true, true, 5, false),
    ('Bulova', 'BULOVA', 'Precisão americana com movimento de alta frequência', true, true, 6, false),
    ('Venezianico', 'VENEZIANICO', 'Elegância italiana inspirada em Veneza', true, true, 7, false)
ON CONFLICT (brand_name) 
DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    is_visible = EXCLUDED.is_visible,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();