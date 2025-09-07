import React, { useState, useEffect } from 'react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Plus, Trash2, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

interface SocialLinks {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

interface CustomLink {
  title: string;
  url: string;
}

const FooterEditor = () => {
  const { settings, isLoading, updateSettings } = useSiteSettingsContext();
  const [isSaving, setIsSaving] = useState(false);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: ''
  });
  
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    whatsapp: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });
  
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    if (settings) {
      const footerContactInfo = settings.footer_contact_info || {};
      const footerSocialLinks = settings.social_links || {};
      const footerCustomLinks = settings.footer_custom_links || [];
      
      setContactInfo({
        phone: footerContactInfo.phone || '',
        email: footerContactInfo.email || '',
        address: footerContactInfo.address || ''
      });
      
      setSocialLinks({
        whatsapp: footerSocialLinks.whatsapp || '',
        instagram: footerSocialLinks.instagram || '',
        facebook: footerSocialLinks.facebook || '',
        twitter: footerSocialLinks.twitter || ''
      });
      
      setCustomLinks(footerCustomLinks);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      console.log('🔄 Salvando configurações do footer:', { contactInfo, socialLinks, customLinks });
      
      const updatedSettings = {
        footer_contact_info: contactInfo,
        social_links: socialLinks,
        footer_custom_links: customLinks
      };
      
      const result = await updateSettings(updatedSettings);
      
      if (result.success) {
        console.log('✅ Footer salvo com sucesso!');
        toast.success('✅ Configurações do footer salvas com sucesso!');
        
        // Force re-fetch to ensure UI reflects saved data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('❌ Erro ao salvar footer:', result.error);
        toast.error('Erro ao salvar configurações: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar footer:', error);
      toast.error('Erro inesperado ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({ ...prev, [field]: value }));
  };

  const addCustomLink = () => {
    setCustomLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const updateCustomLink = (index: number, field: 'title' | 'url', value: string) => {
    setCustomLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(prev => prev.filter((_, i) => i !== index));
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
            <MessageSquare className="h-6 w-6" />
            Editor do Rodapé
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as informações do rodapé do site
          </p>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contato Personalizado</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="links">Informações</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contato Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone || ''}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="(86) 9 8838-8124"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email || ''}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="contato@kajim.com.br"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Atendimento</Label>
                <Textarea
                  id="address"
                  value={contactInfo.address || ''}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  placeholder="Landing pages personalizadas para cada cliente"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (número com código do país)</Label>
                <Input
                  id="whatsapp"
                  value={socialLinks.whatsapp || ''}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="5586988388124"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram (URL completa)</Label>
                <Input
                  id="instagram"
                  value={socialLinks.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/kajimrelogios"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook (URL completa)</Label>
                <Input
                  id="facebook"
                  value={socialLinks.facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/kajimrelogios"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X (URL completa)</Label>
                <Input
                  id="twitter"
                  value={socialLinks.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/kajimrelogios"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Links de Informações</span>
                <Button onClick={addCustomLink} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Link
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={link.title}
                      onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                      placeholder="Ex: Política de Privacidade"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                      placeholder="Ex: /politica-privacidade"
                    />
                  </div>
                  <Button
                    onClick={() => removeCustomLink(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {customLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">Nenhum link personalizado adicionado.</p>
                  <p className="text-sm">Clique em "Adicionar Link" para começar.</p>
                  <p className="text-xs mt-2 text-gray-500">
                    Links padrão (Política de Privacidade, Termos de Uso, Sobre Nós, Garantia) 
                    serão exibidos automaticamente até você adicionar links personalizados.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterEditor;