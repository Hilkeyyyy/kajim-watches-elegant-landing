import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from './useErrorHandler';

interface SiteSettings {
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  hero_background_image_url?: string;
  hero_watch_image_url?: string;
  enable_hero_background_blur?: boolean;
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
  layout_options?: {
    enable_search?: boolean;
    enable_category_auto_generation?: boolean;
    show_featured_section?: boolean;
    show_new_products_section?: boolean;
    show_offers_section?: boolean;
    show_brand_sections?: boolean;
  };
  editable_sections?: {
    quality_badges?: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      enabled: boolean;
    }>;
    custom_blocks?: Array<any>;
  };
}

const defaultSettings: SiteSettings = {
  site_title: 'KAJIM RELÓGIOS',
  hero_title: 'KAJIM RELÓGIOS',
  hero_subtitle: 'Precisão. Estilo. Exclusividade.',
  hero_image_url: '',
  hero_background_image_url: '',
  hero_watch_image_url: '',
  enable_hero_background_blur: true,
  footer_text: 'KAJIM RELÓGIOS - Todos os direitos reservados.',
  about_text: 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
  contact_info: 'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
  additional_info: 'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.',
  hero_gallery: [],
  mid_banners: [],
  show_mid_banners: false,
  homepage_blocks: [],
  footer_links: [],
  show_category_carousel: true,
  layout_options: {
    enable_search: true,
    enable_category_auto_generation: true,
    show_featured_section: true,
    show_new_products_section: true,
    show_offers_section: true,
    show_brand_sections: true
  },
  editable_sections: {
    quality_badges: [
      {
        id: 'quality',
        title: 'Qualidade A++',
        description: 'Movimentos de alta precisão',
        icon: 'A++',
        enabled: true
      },
      {
        id: 'warranty',
        title: 'Garantia',
        description: 'Suporte completo e confiável',
        icon: '🛡️',
        enabled: true
      }
    ],
    custom_blocks: []
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      // Busca direta da tabela para garantir dados atualizados
      const { data: directData, error: directError } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();
          
      if (directError && directError.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', directError);
        setSettings(defaultSettings);
        return;
      }
      
      if (directData) {
        console.log('Configurações carregadas do banco:', directData);
        const settingsData = directData;
        setSettings({
          ...defaultSettings,
          ...settingsData,
          hero_gallery: (Array.isArray(settingsData.hero_gallery) ? settingsData.hero_gallery : defaultSettings.hero_gallery),
          mid_banners: (Array.isArray(settingsData.mid_banners) ? settingsData.mid_banners : defaultSettings.mid_banners),
          homepage_blocks: (Array.isArray(settingsData.homepage_blocks) ? settingsData.homepage_blocks : defaultSettings.homepage_blocks),
          footer_links: (Array.isArray(settingsData.footer_links) ? settingsData.footer_links : defaultSettings.footer_links),
          layout_options: (typeof settingsData.layout_options === 'object' && settingsData.layout_options ? settingsData.layout_options : defaultSettings.layout_options) as any,
          editable_sections: (typeof settingsData.editable_sections === 'object' && settingsData.editable_sections ? settingsData.editable_sections : defaultSettings.editable_sections) as any,
        });
      } else {
        console.log('Nenhuma configuração encontrada, usando padrões');
        setSettings(defaultSettings);
      }
    } catch (error) {
      handleError(error, 'Erro ao carregar configurações do site');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();

      const updatedSettings = { ...settings, ...newSettings };

      let result;
      if (existingSettings) {
        result = await supabase
          .from('site_settings')
          .update(updatedSettings)
          .eq('id', existingSettings.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('site_settings')
          .insert([updatedSettings])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setSettings(updatedSettings);
      return result.data;
    } catch (error) {
      handleError(error, 'Erro ao atualizar configurações');
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    refetch: fetchSettings,
    updateSettings
  };
};