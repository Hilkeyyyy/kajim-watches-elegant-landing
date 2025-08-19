import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';

interface SiteSettings {
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  footer_text: string;
  about_text: string;
  contact_info: string;
  additional_info: string;
}

const defaultSettings: SiteSettings = {
  site_title: 'KAJIM RELÓGIOS',
  hero_title: 'KAJIM RELÓGIOS',
  hero_subtitle: 'Precisão. Estilo. Exclusividade.',
  hero_image_url: '',
  footer_text: 'KAJIM RELÓGIOS - Todos os direitos reservados.',
  about_text: 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
  contact_info: 'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
  additional_info: 'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.'
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
        throw error;
      }

      if (data) {
        setSettings({
          site_title: data.site_title || defaultSettings.site_title,
          hero_title: data.hero_title || defaultSettings.hero_title,
          hero_subtitle: data.hero_subtitle || defaultSettings.hero_subtitle,
          hero_image_url: data.hero_image_url || defaultSettings.hero_image_url,
          footer_text: data.footer_text || defaultSettings.footer_text,
          about_text: data.about_text || defaultSettings.about_text,
          contact_info: data.contact_info || defaultSettings.contact_info,
          additional_info: data.additional_info || defaultSettings.additional_info,
        });
      }
    } catch (error) {
      handleError(error, 'Erro ao carregar configurações do site');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    refetch: fetchSettings
  };
};