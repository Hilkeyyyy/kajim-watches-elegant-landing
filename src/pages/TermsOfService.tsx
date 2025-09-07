import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const TermsOfService = () => {
  const [content, setContent] = useState<{ title: string; body: string }>({
    title: 'Termos de Uso',
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
        p_content_key: 'terms_of_service'
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setContent({
          title: data[0].title || 'Termos de Uso',
          body: data[0].body || 'Conteúdo dos termos de uso ainda não foi configurado.'
        });
      } else {
        setContent({
          title: 'Termos de Uso',
          body: 'Conteúdo dos termos de uso ainda não foi configurado.'
        });
      }
    } catch (error) {
      console.error('Error fetching terms content:', error);
      setContent({
        title: 'Termos de Uso',
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

export default TermsOfService;