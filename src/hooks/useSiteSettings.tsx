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
  hero_gallery?: any[];
  mid_banners?: any[];
  show_mid_banners?: boolean;
  homepage_blocks?: any[];
  footer_links?: any[];
  show_category_carousel?: boolean;
}

const defaultSettings: SiteSettings = {
  site_title: 'KAJIM RELÓGIOS',
  hero_title: 'KAJIM RELÓGIOS',
  hero_subtitle: 'Precisão. Estilo. Exclusividade.',
  hero_image_url: '',
  footer_text: 'KAJIM RELÓGIOS - Todos os direitos reservados.',
  about_text: 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
  contact_info: 'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
  additional_info: 'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.',
  hero_gallery: [],
  mid_banners: [],
  show_mid_banners: false,
  homepage_blocks: [],
  footer_links: [],
  show_category_carousel: true
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
        .select('site_title, hero_title, hero_subtitle, hero_image_url, footer_text, about_text, contact_info, additional_info, hero_gallery, mid_banners, show_mid_banners, homepage_blocks, footer_links, show_category_carousel')
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
          hero_gallery: (Array.isArray(data.hero_gallery) ? data.hero_gallery : defaultSettings.hero_gallery),
          mid_banners: (Array.isArray(data.mid_banners) ? data.mid_banners : defaultSettings.mid_banners),
          show_mid_banners: data.show_mid_banners ?? defaultSettings.show_mid_banners,
          homepage_blocks: (Array.isArray(data.homepage_blocks) ? data.homepage_blocks : defaultSettings.homepage_blocks),
          footer_links: (Array.isArray(data.footer_links) ? data.footer_links : defaultSettings.footer_links),
          show_category_carousel: data.show_category_carousel ?? defaultSettings.show_category_carousel,
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