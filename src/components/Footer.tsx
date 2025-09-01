import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { LoadingSpinner } from './LoadingSpinner';
import { Shield, Award, Clock } from "lucide-react";

const Footer = () => {
  const { settings, isLoading } = useSiteSettingsContext();

  if (isLoading) {
    return (
      <footer className="bg-background border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <LoadingSpinner />
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-slate-950 to-zinc-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1: Sobre */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">{settings.site_title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings.about_text}
            </p>
          </div>

          {/* Coluna 2: Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
            <div className="text-slate-300 text-sm space-y-2">
              {settings.contact_info?.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              )) || null}
            </div>
          </div>

          {/* Coluna 3: Informações */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Informações</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings.additional_info}
            </p>
          </div>

          {/* Coluna 4: Garantia com glassmorphism */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Garantia de Originalidade</h4>
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
              {/* Gradiente de fundo sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl" />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white font-bold text-sm">100% ORIGINAL</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <Award className="h-3 w-3 text-accent" />
                  <span>Certificado de autenticidade</span>
                </div>
                
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <Clock className="h-3 w-3 text-accent" />
                  <span>Garantia internacional</span>
                </div>
                
                <p className="text-white/70 text-xs leading-relaxed mt-3">
                  Todos os relógios são autênticos com certificado de originalidade.
                </p>
              </div>
              
              {/* Efeito de brilho sutil */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800/50 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 {settings.footer_text}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;