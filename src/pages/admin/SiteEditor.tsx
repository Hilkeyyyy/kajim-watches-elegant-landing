
import React, { useState, useEffect } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { Switch } from '@/components/ui/switch';
import { Save, Settings, Image, Type, Layout, ToggleLeft } from 'lucide-react';

interface SiteSettings {
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
  show_category_carousel?: boolean;
  show_mid_banners?: boolean;
  [key: string]: any;
}

const SiteEditor = () => {
  const { settings: currentSettings, isLoading, refetch } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(currentSettings || {});
  const [isSaving, setIsSaving] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  // Update local settings when current settings change
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Verificar se já existe configuração
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();

      let result;
      if (existingSettings) {
        // Atualizar configuração existente
        result = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', existingSettings.id);
      } else {
        // Criar nova configuração
        result = await supabase
          .from('site_settings')
          .insert([settings]);
      }

      if (result.error) throw result.error;

      handleSuccess('Configurações salvas com sucesso!');
      await refetch(); // Refresh settings
    } catch (error) {
      handleError(error, 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field: string) => (url: string) => {
    handleInputChange(field, url);
  };

  const handleImageRemove = (field: string) => () => {
    handleInputChange(field, '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <TabsList className="grid w-full grid-cols-5 bg-muted/30">
          <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:text-primary">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:text-primary">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:text-primary">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Conteúdo</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:text-primary">
            <ToggleLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-accent/10 data-[state=active]:text-primary">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Rodapé</span>
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
                  value={settings.site_title || ''}
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
                  value={settings.hero_title || ''}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  placeholder="KAJIM RELÓGIOS"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Subtítulo</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  placeholder="Precisão. Estilo. Exclusividade."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagem</Label>
                <ImageUpload
                  bucket="category-images"
                  currentImageUrl={settings.hero_image_url}
                  onImageUploaded={handleImageUpload('hero_image_url')}
                  onImageRemoved={handleImageRemove('hero_image_url')}
                  className="w-full h-48"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <ImageUpload
                  bucket="category-images"
                  currentImageUrl={settings.hero_background_image_url}
                  onImageUploaded={handleImageUpload('hero_background_image_url')}
                  onImageRemoved={handleImageRemove('hero_background_image_url')}
                  className="w-full h-48"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem do Relógio (Hero)</Label>
                <ImageUpload
                  bucket="category-images"
                  currentImageUrl={settings.hero_watch_image_url}
                  onImageUploaded={handleImageUpload('hero_watch_image_url')}
                  onImageRemoved={handleImageRemove('hero_watch_image_url')}
                  className="w-full h-48"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <Label htmlFor="enable_hero_background_blur" className="text-base font-medium">
                      Blur na Imagem de Fundo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Aplicar efeito de desfoque na imagem de fundo do Hero
                    </p>
                  </div>
                  <Switch
                    id="enable_hero_background_blur"
                    checked={settings.enable_hero_background_blur ?? true}
                    onCheckedChange={(checked) => 
                      handleInputChange('enable_hero_background_blur', checked)
                    }
                  />
                </div>
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
                  value={settings.about_text || ''}
                  onChange={(e) => handleInputChange('about_text', e.target.value)}
                  placeholder="Descrição da empresa..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional_info">Informações Adicionais</Label>
                <Textarea
                  id="additional_info"
                  value={settings.additional_info || ''}
                  onChange={(e) => handleInputChange('additional_info', e.target.value)}
                  placeholder="Informações extras sobre qualidade, garantia, etc..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_info">Informações de Contato</Label>
                <Textarea
                  id="contact_info"
                  value={settings.contact_info || ''}
                  onChange={(e) => handleInputChange('contact_info', e.target.value)}
                  placeholder="Telefone, e-mail, endereço..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Controles de Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <Label htmlFor="show_category_carousel" className="text-base font-medium">
                      Carrossel de Categorias
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar o carrossel com categorias de marcas na página inicial
                    </p>
                  </div>
                  <Switch
                    id="show_category_carousel"
                    checked={settings.show_category_carousel ?? true}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, show_category_carousel: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <Label htmlFor="show_mid_banners" className="text-base font-medium">
                      Banners do Meio
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Exibir banners promocionais no meio da página
                    </p>
                  </div>
                  <Switch
                    id="show_mid_banners"
                    checked={settings.show_mid_banners ?? false}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, show_mid_banners: checked }))
                    }
                  />
                </div>
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
                  value={settings.footer_text || ''}
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
