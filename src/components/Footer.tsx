import { useSiteSettings } from '@/hooks/useSiteSettings';
import { LoadingSpinner } from './LoadingSpinner';

const Footer = () => {
  const { settings, isLoading } = useSiteSettings();

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
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="font-playfair text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {settings.site_title}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {settings.about_text}
            </p>
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-lg">
              <p className="text-white font-semibold text-sm flex items-center gap-2">
                ✓ <span className="font-bold">100% ORIGINAIS</span>
              </p>
              <p className="text-white/80 text-xs mt-1">
                KAJIM trabalha exclusivamente com relógios originais, nunca réplicas ou clones.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-xl mb-4 text-white">
              Contato
            </h4>
            <div className="space-y-2 text-gray-300">
              {settings.contact_info.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-xl mb-4 text-white">
              Sobre Nossos Produtos
            </h4>
            <p className="text-gray-300 leading-relaxed">
              {settings.additional_info}
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 shadow-lg">
              <span className="text-white text-lg">🏆</span>
              <span className="text-white font-bold text-sm">GARANTIA DE ORIGINALIDADE</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 {settings.footer_text}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Todos os relógios vendidos pela KAJIM são 100% originais e acompanham certificado de autenticidade.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;