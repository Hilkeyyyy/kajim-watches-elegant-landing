import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const PrivacyPolicy = () => {
  const [content, setContent] = useState<{ title: string; body: string }>({
    title: 'Política de Privacidade',
    body: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('get_content_block_public', {
        p_content_key: 'privacy_policy'
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setContent({
          title: data[0].title || 'Política de Privacidade',
          body: data[0].body || 'Conteúdo da política de privacidade ainda não foi configurado.'
        });
      } else {
        setContent({
          title: 'Política de Privacidade',
          body: 'Conteúdo da política de privacidade ainda não foi configurado.'
        });
      }
    } catch (error) {
      console.error('Error fetching privacy policy content:', error);
      setContent({
        title: 'Política de Privacidade',
        body: 'Erro ao carregar o conteúdo. Tente novamente mais tarde.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {content.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {content.body}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;