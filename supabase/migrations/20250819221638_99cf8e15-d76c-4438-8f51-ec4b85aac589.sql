
-- Criar tabela para configurações do site
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_title TEXT DEFAULT 'KAJIM RELÓGIOS',
  hero_title TEXT DEFAULT 'KAJIM RELÓGIOS',
  hero_subtitle TEXT DEFAULT 'Precisão. Estilo. Exclusividade.',
  hero_image_url TEXT,
  footer_text TEXT DEFAULT 'KAJIM RELÓGIOS - Todos os direitos reservados.',
  about_text TEXT DEFAULT 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
  contact_info TEXT DEFAULT 'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
  additional_info TEXT DEFAULT 'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Política para visualização pública das configurações
CREATE POLICY "Configurações do site são públicas"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Política para que apenas admins possam modificar
CREATE POLICY "Apenas admins podem modificar configurações"
  ON public.site_settings
  FOR ALL
  USING (is_admin(auth.uid()));

-- Inserir configuração padrão
INSERT INTO public.site_settings (site_title, hero_title, hero_subtitle, footer_text, about_text, contact_info, additional_info)
VALUES (
  'KAJIM RELÓGIOS',
  'KAJIM RELÓGIOS', 
  'Precisão. Estilo. Exclusividade.',
  'KAJIM RELÓGIOS - Todos os direitos reservados.',
  'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
  'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
  'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.'
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
