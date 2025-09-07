import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { LoadingSpinner } from './LoadingSpinner';
import { Shield, Award, Clock, Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { Link } from 'react-router-dom';

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

  const brands = ['ROLEX', 'TAG Heuer', 'HAMILTON', 'VENEZIANICO'];
  const socialLinks = settings.social_links || {};
  const contactInfo = settings.footer_contact_info || {};
  const customLinks = settings.footer_custom_links || [];

  const handleWhatsAppClick = () => {
    if (socialLinks.whatsapp) {
      const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os relógios disponíveis.');
      window.open(`https://wa.me/${socialLinks.whatsapp}?text=${message}`, '_blank');
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 text-white">
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Logo e Redes Sociais */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 font-playfair">
            {settings.site_title}
          </h2>
          
          {/* Social Icons */}
          <div className="flex justify-center gap-4">
            {socialLinks.whatsapp && (
              <button
                onClick={handleWhatsAppClick}
                className="group relative w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-green-500/25"
              >
                <MessageCircle className="h-6 w-6 text-white" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Entre em contato
                </div>
              </button>
            )}
            
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/25"
              >
                <Instagram className="h-6 w-6 text-white" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Instagram
                </div>
              </a>
            )}
            
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/25"
              >
                <Facebook className="h-6 w-6 text-white" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Facebook
                </div>
              </a>
            )}
            
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center hover:from-slate-800 hover:to-slate-900 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-slate-500/25"
              >
                <Twitter className="h-6 w-6 text-white" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Twitter
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Coluna 1: Contato Personalizado */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-6 font-inter tracking-wide">
              CONTATO PERSONALIZADO
            </h3>
            
            <div className="space-y-4">
              {contactInfo.phone && (
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-200 shadow-md">
                    <Phone className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Telefone</p>
                    <p className="text-slate-300 text-sm">{contactInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-200 shadow-md">
                    <Mail className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">E-mail</p>
                    <p className="text-slate-300 text-sm">{contactInfo.email}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.address && (
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary/30 to-accent/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-200 shadow-md">
                    <MapPin className="h-4 w-4 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <p className="text-white/90 text-sm font-medium mb-1">Atendimento</p>
                    <p className="text-slate-300 text-sm">{contactInfo.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Coluna 2: Categorias (Marcas) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-6 font-inter tracking-wide">
              CATEGORIAS
            </h3>
            
            <div className="space-y-3">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to={`/marca/${brand.toLowerCase().replace(' ', '-')}`}
                  className="block text-slate-300 hover:text-primary text-sm transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Coluna 3: Informações */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-6 font-inter tracking-wide">
              INFORMAÇÕES
            </h3>
            
            <div className="space-y-3">
              {customLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="block text-slate-300 hover:text-primary text-sm transition-colors duration-200 hover:translate-x-1 transform"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            
            {settings.additional_info && (
              <p className="text-slate-400 text-sm leading-relaxed mt-4">
                {settings.additional_info}
              </p>
            )}
          </div>

          {/* Coluna 4: Garantia de Originalidade */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-6 font-inter tracking-wide">
              GARANTIA DE ORIGINALIDADE
            </h3>
            
            <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full shadow-md">
                    <Shield className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                  <span className="text-white font-bold text-sm">100% ORIGINAL</span>
                </div>
                
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <Award className="h-4 w-4 text-white drop-shadow-sm flex-shrink-0" />
                  <span>Certificado de autenticidade</span>
                </div>
                
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <Clock className="h-4 w-4 text-white drop-shadow-sm flex-shrink-0" />
                  <span>Garantia internacional</span>
                </div>
                
                <p className="text-white/70 text-xs leading-relaxed mt-4">
                  Todos os relógios são autênticos com certificado de originalidade.
                </p>
              </div>
              
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800/30 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 {settings.footer_text}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;