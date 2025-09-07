import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const About = () => {
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
              Sobre Nós
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
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Uma combinação entre precisão, elegância e acessibilidade. Especializados em relógios 100% originais com garantia internacional.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">100% Originais</h3>
              <p className="text-muted-foreground">
                Todos os nossos relógios são autênticos com certificado de originalidade e garantia internacional.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Qualidade Premium</h3>
              <p className="text-muted-foreground">
                Cada peça é cuidadosamente selecionada para oferecer a você a experiência de luxo que merece.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Atendimento Personalizado</h3>
              <p className="text-muted-foreground">
                Criamos landing pages personalizadas para cada cliente, garantindo uma experiência única.
              </p>
            </div>
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