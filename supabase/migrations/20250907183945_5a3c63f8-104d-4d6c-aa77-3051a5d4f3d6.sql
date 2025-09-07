-- Atualizar o texto "Sobre nós" com as marcas específicas da KAJIM
UPDATE site_settings 
SET about_text = 'A KAJIM Relógios é especialista em relógios de luxo 100% originais das melhores marcas do mundo. 

🇺🇸 HAMILTON - Tradição americana desde 1892, famosa pelos relógios militares e de aviação com precisão incomparável.

🇯🇵 SEIKO - Pioneira japonesa em inovação relojoeira, criadora do movimento quartzo e dos icônicos mergulhadores.

🇫🇷 BALTIC - Marca francesa contemporânea que une design vintage com tecnologia moderna em peças exclusivas.

🇯🇵 CITIZEN - Líder mundial em tecnologia Eco-Drive, relógios movidos à luz com autonomia excepcional.

🇨🇭 TAG HEUER - Suíça pura, especialista em cronógrafos esportivos e relógios de alta performance desde 1860.

🇺🇸 BULOVA - Americana histórica, pioneira em precisão e design inovador há mais de 145 anos.

🇮🇹 VENEZIANICO - Italiana artesanal que celebra a tradição veneziana com relógios únicos e elegantes.

Na KAJIM, cada relógio tem procedência verificada, garantia internacional e entrega segura. Somos especialistas em autenticar e selecionar apenas peças originais para colecionadores e apaixonados por relojoaria de qualidade.'
WHERE id = (SELECT id FROM site_settings LIMIT 1);