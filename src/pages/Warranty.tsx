import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
export const Warranty = () => {
  const [content, setContent] = useState<{ title: string; body: string }>({ title: 'Garantia', body: '' });

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.rpc('get_content_block_public', { p_content_key: 'warranty' });
      if (!error && data && data.length > 0) {
        setContent({ title: data[0].title || 'Garantia', body: data[0].body || '' });
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    document.title = `${content.title} | KAJIM`;
  }, [content.title]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-serif">
              {content.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {content.body ? (
            <article className="space-y-4 leading-relaxed">
              <div
                className="text-base"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.body) }}
              />
            </article>
          ) : (
            <div className="text-muted-foreground">
              Conteúdo de Garantia ainda não foi cadastrado. Acesse Administração › Editor de Conteúdo › Garantia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Warranty;