import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, FileText, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ContentBlock {
  title: string;
  body: string;
}

const ContentEditor = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [termsContent, setTermsContent] = useState<ContentBlock>({
    title: 'Termos de Uso',
    body: ''
  });
  const [privacyContent, setPrivacyContent] = useState<ContentBlock>({
    title: 'Política de Privacidade',
    body: ''
  });
  const [aboutContent, setAboutContent] = useState<ContentBlock>({
    title: 'Sobre Nós',
    body: ''
  });
  const [warrantyContent, setWarrantyContent] = useState<ContentBlock>({
    title: 'Garantia',
    body: ''
  });

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const contentKeys = [
        { key: 'terms_of_service', setter: setTermsContent, defaultTitle: 'Termos de Uso' },
        { key: 'privacy_policy', setter: setPrivacyContent, defaultTitle: 'Política de Privacidade' },
        { key: 'about_us', setter: setAboutContent, defaultTitle: 'Sobre Nós' },
        { key: 'warranty', setter: setWarrantyContent, defaultTitle: 'Garantia' }
      ];

      for (const { key, setter, defaultTitle } of contentKeys) {
        const { data, error } = await supabase.rpc('get_content_block_public', {
          p_content_key: key
        });
        
        if (!error && data && data.length > 0) {
          setter({
            title: data[0].title || defaultTitle,
            body: data[0].body || ''
          });
        } else {
          setter({
            title: defaultTitle,
            body: ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Erro ao carregar conteúdo');
    }
  };

  const saveContent = async (contentKey: string, content: ContentBlock) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase.rpc('upsert_content_block', {
        p_content_key: contentKey,
        data: {
          title: content.title,
          body: content.body
        }
      });

      if (error) throw error;
      
      toast.success(`${content.title} salvo com sucesso!`);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(`Erro ao salvar ${content.title}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Editor de Conteúdo
          </h1>
          <p className="text-muted-foreground">
            Gerencie o conteúdo das páginas de informação do site
          </p>
        </div>
      </div>

      <Tabs defaultValue="terms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="terms" className="gap-2">
            <FileText className="h-4 w-4" />
            Termos de Uso
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="h-4 w-4" />
            Sobre Nós
          </TabsTrigger>
          <TabsTrigger value="warranty" className="gap-2">
            <Shield className="h-4 w-4" />
            Garantia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Termos de Uso</span>
                <Button 
                  onClick={() => saveContent('terms_of_service', termsContent)}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms-title">Título</Label>
                <Input
                  id="terms-title"
                  value={termsContent.title}
                  onChange={(e) => setTermsContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Termos de Uso"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="terms-body">Conteúdo</Label>
                <Textarea
                  id="terms-body"
                  value={termsContent.body}
                  onChange={(e) => setTermsContent(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Digite o conteúdo dos termos de uso..."
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Política de Privacidade</span>
                <Button 
                  onClick={() => saveContent('privacy_policy', privacyContent)}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacy-title">Título</Label>
                <Input
                  id="privacy-title"
                  value={privacyContent.title}
                  onChange={(e) => setPrivacyContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Política de Privacidade"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="privacy-body">Conteúdo</Label>
                <Textarea
                  id="privacy-body"
                  value={privacyContent.body}
                  onChange={(e) => setPrivacyContent(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Digite o conteúdo da política de privacidade..."
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sobre Nós</span>
                <Button 
                  onClick={() => saveContent('about_us', aboutContent)}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sobre Nós"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-body">Conteúdo</Label>
                <Textarea
                  id="about-body"
                  value={aboutContent.body}
                  onChange={(e) => setAboutContent(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Digite o conteúdo sobre a empresa..."
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Garantia</span>
                <Button 
                  onClick={() => saveContent('warranty', warrantyContent)}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Salvar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warranty-title">Título</Label>
                <Input
                  id="warranty-title"
                  value={warrantyContent.title}
                  onChange={(e) => setWarrantyContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Garantia"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warranty-body">Conteúdo</Label>
                <Textarea
                  id="warranty-body"
                  value={warrantyContent.body}
                  onChange={(e) => setWarrantyContent(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Digite as informações sobre garantia..."
                  rows={15}
                  className="min-h-[400px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;