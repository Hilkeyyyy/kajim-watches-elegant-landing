import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/integrations/supabase/client';

export const About = () => {
  const [content, setContent] = useState<{ title: string; body: string; extra?: any }>({ title: 'Sobre Nós', body: '', extra: undefined });

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.rpc('get_content_block_public', { p_content_key: 'about_us' });
      if (!error && data && data.length > 0) {
        const row = data[0];
        setContent({ title: row.title || 'Sobre Nós', body: row.body || '', extra: row.extra || {} });
        document.title = `${row.title || 'Sobre Nós'} | KAJIM`;
      } else {
        document.title = 'Sobre Nós | KAJIM';
      }
    };
    fetchContent();
  }, []);

  const defaultBrands = [
    { name: 'HAMILTON', flag: '🇺🇸', description: 'Tradição americana desde 1892, famosa pelos relógios militares e de aviação com precisão incomparável.' },
    { name: 'SEIKO', flag: '🇯🇵', description: 'Pioneira japonesa em inovação relojoeira, criadora do movimento quartzo e dos icônicos mergulhadores.' },
    { name: 'BALTIC', flag: '🇫🇷', description: 'Marca francesa contemporânea que une design vintage com tecnologia moderna em peças exclusivas.' },
    { name: 'CITIZEN', flag: '🇯🇵', description: 'Líder mundial em tecnologia Eco-Drive, relógios movidos à luz com autonomia excepcional.' },
    { name: 'TAG HEUER', flag: '🇨🇭', description: 'Suíça pura, especialista em cronógrafos esportivos e relógios de alta performance desde 1860.' },
    { name: 'BULOVA', flag: '🇺🇸', description: 'Americana histórica, pioneira em precisão e design inovador há mais de 145 anos.' },
    { name: 'VENEZIANICO', flag: '🇮🇹', description: 'Italiana artesanal que celebra a tradição veneziana com relógios únicos e elegantes.' },
  ];

  const brands = Array.isArray(content?.extra?.brands) && content.extra.brands.length > 0
    ? content.extra.brands
    : defaultBrands;

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
              Conheça nossa história e compromisso
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Star className="h-4 w-4" />
              Excelência em Relógios de Luxo
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              KAJIM RELÓGIOS
            </h2>
            
            <div className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
              {content.body || 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.'}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand: any, idx: number) => (
              <div key={idx} className="p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-2xl">
                  <span aria-hidden="true">{brand.flag || '⌚'}</span>
                </div>
                <h3 className="mt-4 text-center text-xl font-semibold">{brand.flag ? `${brand.flag} ${brand.name}` : brand.name}</h3>
                <p className="mt-2 text-center text-muted-foreground">{brand.description}</p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12 border border-border/20">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Nossa Missão
            </h3>
            <p className="text-lg text-muted-foreground text-center leading-relaxed max-w-3xl mx-auto">
              Democratizar o acesso a relógios de luxo autênticos, oferecendo produtos de qualidade excepcional 
              com atendimento personalizado. Acreditamos que cada cliente merece uma experiência única e 
              memorável na busca pelo timepiece perfeito.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center space-y-6 py-8">
            <h3 className="text-2xl font-bold">
              Pronto para encontrar seu relógio ideal?
            </h3>
            <p className="text-muted-foreground">
              Entre em contato conosco e descubra nossa coleção exclusiva
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                Explorar Coleção
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;