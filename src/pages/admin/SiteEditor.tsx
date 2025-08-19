
import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { Save, Settings, Image, Type, Layout } from 'lucide-react';

interface SiteSettings {
  site_title: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  footer_text: string;
  about_text: string;
  contact_info: string;
  additional_info: string;
}

const SiteEditor = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'KAJIM RELÓGIOS',
    hero_title: 'KAJIM RELÓGIOS',
    hero_subtitle: 'Precisão. Estilo. Exclusividade.',
    hero_image_url: '',
    footer_text: 'KAJIM RELÓGIOS - Todos os direitos reservados.',
    about_text: 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.',
    contact_info: 'Telefone: (86) 9 8838-8124\nE-mail: contato@kajim.com.br',
    additional_info: 'Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      // Não mostrar erro se for primeira vez (tabela vazia)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('site_settings')
        .upsert(settings, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      handleSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      handleError(error, 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Editor Avançado do Site
          </h1>
          <p className="text-muted-foreground">
            Personalize completamente a aparência e conteúdo do seu site
          </p>
        </div>
        
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Type className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <Image className="h-4 w-4" />
            Seção Hero
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Layout className="h-4 w-4" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Settings className="h-4 w-4" />
            Rodapé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Título do Site</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="KAJIM RELÓGIOS"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seção Principal (Hero)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Título Principal</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="KAJIM RELÓGIOS"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Subtítulo</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="Precisão. Estilo. Exclusividade."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <ImageUpload
                  value={settings.hero_image_url}
                  onChange={(url) => handleInputChange('hero_image_url', url)}
                  bucket="category-images"
                  className="w-full h-48"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about_text">Texto Sobre a Empresa</Label>
                <Textarea
                  id="about_text"
                  value={settings.about_text}
                  onChange={(e) => handleInputChange('about_text', e.target.value)}
                  placeholder="Descrição da empresa..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional_info">Informações Adicionais</Label>
                <Textarea
                  id="additional_info"
                  value={settings.additional_info}
                  onChange={(e) => handleInputChange('additional_info', e.target.value)}
                  placeholder="Informações extras sobre qualidade, garantia, etc..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_info">Informações de Contato</Label>
                <Textarea
                  id="contact_info"
                  value={settings.contact_info}
                  onChange={(e) => handleInputChange('contact_info', e.target.value)}
                  placeholder="Telefone, e-mail, endereço..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rodapé do Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer_text">Texto do Rodapé</Label>
                <Textarea
                  id="footer_text"
                  value={settings.footer_text}
                  onChange={(e) => handleInputChange('footer_text', e.target.value)}
                  placeholder="Texto que aparece no rodapé do site..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Área de Edição Profissional</h3>
              <p className="text-sm text-muted-foreground">
                Todas as alterações são aplicadas em tempo real no site. 
                Salve suas configurações para manter as mudanças permanentes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteEditor;
