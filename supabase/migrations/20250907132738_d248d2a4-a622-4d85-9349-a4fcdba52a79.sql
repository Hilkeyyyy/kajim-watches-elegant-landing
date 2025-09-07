-- Adicionar novos campos para redes sociais e configurações do footer
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{"whatsapp": "", "instagram": "", "facebook": "", "twitter": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS footer_contact_info jsonb DEFAULT '{"phone": "", "email": "", "address": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS footer_custom_links jsonb DEFAULT '[]'::jsonb;