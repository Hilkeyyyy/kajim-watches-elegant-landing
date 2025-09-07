import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface SiteSettings {
  id?: string;
  site_title?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_background_image_url?: string;
  hero_watch_image_url?: string;
  enable_hero_background_blur?: boolean;
  footer_text?: string;
  about_text?: string;
  contact_info?: string;
  additional_info?: string;
  hero_gallery?: any[];
  mid_banners?: any[];
  show_mid_banners?: boolean;
  homepage_blocks?: any[];
  footer_links?: any[];
  show_category_carousel?: boolean;
  layout_options?: any;
  editable_sections?: any;
  social_links?: any;
  footer_contact_info?: any;
  footer_custom_links?: any[];
  [key: string]: any;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  refetch: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  site_title: 'KAJIM RELÓGIOS',
  hero_title: 'KAJIM RELÓGIOS',
  hero_subtitle: 'Precisão. Estilo. Exclusividade.',
  hero_image_url: '',
  hero_background_image_url: '',
  hero_watch_image_url: '',
  enable_hero_background_blur: false,
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
  },
  social_links: {
    whatsapp: '5586988388124',
    instagram: '',
    facebook: '',
    twitter: ''
  },
  footer_contact_info: {
    phone: '(86) 9 8838-8124',
    email: 'contato@kajim.com.br',
    address: 'Landing pages personalizadas para cada cliente'
  },
  footer_custom_links: [
    { title: 'Política de Privacidade', url: '#' },
    { title: 'Termos de Uso', url: '#' },
    { title: 'Sobre Nós', url: '#' },
    { title: 'Garantia', url: '#' }
  ]
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useErrorHandler();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Buscando configurações via RPC público...');
      
      // Primeiro tenta via função pública segura (sem dados sensíveis)
      const { data: publicData, error: publicError } = await supabase
        .rpc('get_site_settings_public');

      if (!publicError && publicData && publicData.length > 0) {
        console.log('✅ Configurações carregadas via RPC público:', publicData[0]);
        const mergedSettings = { ...defaultSettings, ...publicData[0] };
        setSettings(mergedSettings);
        return;
      }

      console.log('⚠️ RPC público falhou, tentando acesso direto (admin)...');
      
      // Fallback: acesso direto para admins
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao carregar configurações:', error);
        setSettings(defaultSettings);
        return;
      }

      if (data) {
        console.log('✅ Configurações carregadas via acesso direto:', data);
        const mergedSettings = { ...defaultSettings, ...data };
        setSettings(mergedSettings);
      } else {
        console.log('⚠️ Nenhuma configuração encontrada, usando padrões');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      handleError(error, 'Erro ao carregar configurações do site');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      console.log('💾 Salvando configurações via RPC:', newSettings);
      
      const { data, error } = await supabase
        .rpc('upsert_site_settings', { new_settings: newSettings });

      if (error) {
        console.error('❌ Erro ao salvar via RPC:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Configurações salvas com sucesso via RPC:', data);
      
      // Atualiza o estado local com os dados retornados
      const updatedSettings = { ...defaultSettings, ...data };
      setSettings(updatedSettings);
      
      // Force refetch from database to ensure we have the latest persisted data
      await fetchSettings();
      
      // Notifica todos os componentes da mudança
      window.dispatchEvent(new CustomEvent('site-settings-updated', { 
        detail: updatedSettings 
      }));

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error);
      handleError(error, 'Erro ao salvar configurações');
      return { success: false, error: error.message };
    }
  };

  const refetch = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
    
    // Escutar mudanças em tempo real
    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          console.log('🔄 Configurações atualizadas em tempo real:', payload);
          if (payload.new) {
            setSettings(prev => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const contextValue: SiteSettingsContextType = {
    settings,
    isLoading,
    updateSettings,
    refetch
  };

  return (
    <SiteSettingsContext.Provider value={contextValue}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettingsContext = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettingsContext deve ser usado dentro de SiteSettingsProvider');
  }
  return context;
};