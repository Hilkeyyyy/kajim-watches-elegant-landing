import { useSiteSettingsContext } from "@/contexts/SiteSettingsContext";
import { LoadingSpinner } from "./LoadingSpinner";
import watchDetails from "@/assets/watch-details.jpg";
import { useSecurity } from "@/hooks/useSecurity";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutContent {
  title: string;
  body: string;
}

const AboutSection = () => {
  const { settings, isLoading } = useSiteSettingsContext();
  const { sanitizeHtml } = useSecurity();
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data, error } = await supabase.rpc('get_content_block_public', {
          p_content_key: 'about_section'
        });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAboutContent({
            title: data[0].title || 'Sobre KAJIM',
            body: data[0].body || settings.about_text || 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.'
          });
        } else {
          // Fallback to settings
          setAboutContent({
            title: 'Sobre KAJIM',
            body: settings.about_text || 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.'
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Fallback to settings
        setAboutContent({
          title: 'Sobre KAJIM',
          body: settings.about_text || 'KAJIM WATCHES é uma combinação entre precisão, elegância e acessibilidade. Relógios 100% originais com garantia.'
        });
      }
    };

    if (!isLoading) {
      fetchAboutContent();
    }
  }, [settings.about_text, isLoading]);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold mb-8 tracking-wide">
              {aboutContent?.title || 'Sobre KAJIM'}
            </h2>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                {aboutContent?.body || settings.about_text}
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                {settings.additional_info}
              </p>
            </div>

            {/* Quality Features - Filtradas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {settings.editable_sections?.quality_badges?.filter(badge => 
                badge.enabled && 
                !badge.title.toLowerCase().includes('a++') && 
                !badge.title.toLowerCase().includes('garantia')
              ).map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                    <span className="text-2xl font-bold text-white">{badge.icon}</span>
                  </div>
                  <h3 className="text-xl font-playfair font-semibold mb-2">
                    {badge.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Custom Blocks - Sanitized for Security */}
            {settings.editable_sections?.custom_blocks?.map((block, index) => (
              <div key={index} className="mt-8">
                {block.type === 'text' && (
                  <p className="text-lg text-gray-200 leading-relaxed">{block.content}</p>
                )}
                {block.type === 'html' && (
                  <div dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(block.content)
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
              <img 
                src={watchDetails} 
                alt="KAJIM Luxury Watch Details" 
                className="relative w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;