import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/integrations/supabase/client';

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
    document.title = `${content.title} | KAJIM`;
  }, []);

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
            <p className="text-muted-foreground font-light">
              Proteção completa para seu investimento
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-600 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Garantia Internacional
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Suporte Completo e Confiável
            </h2>
            
            <div className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
              {content.body || 'Todos os nossos relógios vêm com garantia internacional completa, assegurando proteção total para seu investimento.'}
            </div>
          </div>

          {/* Warranty Coverage */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                O que está coberto
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Defeitos de Fabricação</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Problemas no movimento, caixa ou outros componentes originais
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Manutenção Preventiva</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Revisões periódicas para manter a precisão e funcionamento
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">Peças Originais</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Substituição apenas com componentes autênticos da marca
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                Períodos de Garantia
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h4 className="font-semibold mb-2">Relógios Mecânicos</h4>
                  <p className="text-muted-foreground text-sm">
                    2 anos de garantia internacional para movimento e componentes
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <h4 className="font-semibold mb-2">Relógios Quartz</h4>
                  <p className="text-muted-foreground text-sm">
                    3 anos de garantia internacional para eletrônicos e movimento
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card">
                  <h4 className="font-semibold mb-2">Smartwatches</h4>
                  <p className="text-muted-foreground text-sm">
                    1 ano de garantia internacional para componentes eletrônicos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12 border border-border/20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Como Utilizar sua Garantia
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  1
                </div>
                <h4 className="font-semibold">Entre em Contato</h4>
                <p className="text-sm text-muted-foreground">
                  Ligue ou envie mensagem pelo WhatsApp descrevendo o problema
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  2
                </div>
                <h4 className="font-semibold">Avaliação Técnica</h4>
                <p className="text-sm text-muted-foreground">
                  Nossa equipe avalia o caso e orienta sobre os próximos passos
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  3
                </div>
                <h4 className="font-semibold">Reparo ou Troca</h4>
                <p className="text-sm text-muted-foreground">
                  Realizamos o reparo ou troca conforme necessário
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center space-y-6 py-8 border-t border-border">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-3">
              <Phone className="h-6 w-6" />
              Precisa de Suporte?
            </h3>
            <p className="text-muted-foreground">
              Nossa equipe está pronta para ajudar com qualquer questão sobre garantia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <a href="tel:+5586988388124">
                  <Phone className="h-4 w-4" />
                  (86) 9 8838-8124
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  Voltar à Loja
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;