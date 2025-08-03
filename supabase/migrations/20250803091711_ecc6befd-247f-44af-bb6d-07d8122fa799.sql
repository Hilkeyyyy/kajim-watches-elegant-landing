-- Adicionar campos de especificações que podem estar faltantes na tabela products
-- Baseado nas referências das imagens, vamos garantir que todos os campos necessários existem

-- Cores do relógio
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS dial_colors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS case_color TEXT,
ADD COLUMN IF NOT EXISTS bezel_color TEXT,
ADD COLUMN IF NOT EXISTS hands_color TEXT,
ADD COLUMN IF NOT EXISTS markers_color TEXT,
ADD COLUMN IF NOT EXISTS strap_color TEXT;

-- Especificações básicas adicionais
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS crystal TEXT,
ADD COLUMN IF NOT EXISTS case_material TEXT,
ADD COLUMN IF NOT EXISTS bezel_material TEXT,
ADD COLUMN IF NOT EXISTS dial_material TEXT,
ADD COLUMN IF NOT EXISTS hands_material TEXT,
ADD COLUMN IF NOT EXISTS crown_material TEXT,
ADD COLUMN IF NOT EXISTS caseback_material TEXT;

-- Especificações de movimento
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS caliber TEXT,
ADD COLUMN IF NOT EXISTS jewels_count TEXT,
ADD COLUMN IF NOT EXISTS frequency_hz TEXT,
ADD COLUMN IF NOT EXISTS amplitude_degrees TEXT,
ADD COLUMN IF NOT EXISTS beat_error_ms TEXT;

-- Dimensões detalhadas
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS case_diameter TEXT,
ADD COLUMN IF NOT EXISTS case_height TEXT,
ADD COLUMN IF NOT EXISTS case_thickness TEXT,
ADD COLUMN IF NOT EXISTS lug_to_lug TEXT,
ADD COLUMN IF NOT EXISTS lug_width_mm TEXT,
ADD COLUMN IF NOT EXISTS crown_diameter TEXT,
ADD COLUMN IF NOT EXISTS crystal_diameter TEXT;

-- Resistências e certificações
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS water_resistance_meters TEXT,
ADD COLUMN IF NOT EXISTS water_resistance_atm TEXT,
ADD COLUMN IF NOT EXISTS shock_resistant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS anti_magnetic_resistance TEXT,
ADD COLUMN IF NOT EXISTS temperature_resistance TEXT;

-- Características visuais
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS dial_pattern TEXT,
ADD COLUMN IF NOT EXISTS dial_finish TEXT,
ADD COLUMN IF NOT EXISTS indices_type TEXT,
ADD COLUMN IF NOT EXISTS indices_material TEXT,
ADD COLUMN IF NOT EXISTS numerals_type TEXT,
ADD COLUMN IF NOT EXISTS logo_position TEXT;

-- Pulseira/bracelete
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS bracelet_material TEXT,
ADD COLUMN IF NOT EXISTS bracelet_width TEXT,
ADD COLUMN IF NOT EXISTS bracelet_length TEXT,
ADD COLUMN IF NOT EXISTS clasp_material TEXT,
ADD COLUMN IF NOT EXISTS clasp_width TEXT;

-- Embalagem e acessórios
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS box_type TEXT,
ADD COLUMN IF NOT EXISTS documentation TEXT,
ADD COLUMN IF NOT EXISTS included_accessories TEXT[];

-- Informações comerciais
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS msrp TEXT,
ADD COLUMN IF NOT EXISTS availability_status TEXT,
ADD COLUMN IF NOT EXISTS discontinued_date DATE,
ADD COLUMN IF NOT EXISTS replacement_model TEXT;