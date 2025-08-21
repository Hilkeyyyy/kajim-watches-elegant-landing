import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { LoadingSpinner } from "./LoadingSpinner";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  const { settings, isLoading } = useSiteSettings();
  
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-background flex flex-col justify-center items-center">
        <LoadingSpinner />
      </section>
    );
  }

  // Parse hero title to separate words
  const titleParts = settings.hero_title.split(' ');
  const firstWord = titleParts[0] || 'RELÓGIOS';
  const secondWord = titleParts[1] || 'KAJIM';

  const heroImageUrl = settings.hero_image_url || heroWatch;

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden px-4 py-12">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>
      
      {/* Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-foreground mb-2 tracking-[0.02em] leading-tight">
            {firstWord}
          </h1>
          <h2 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground tracking-[0.05em] leading-none">
            {secondWord}
          </h2>
        </div>
        
        {/* Subtitle */}
        <p className="font-inter text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 tracking-wide font-light">
          {settings.hero_subtitle}
        </p>
        
        {/* Original Guarantee Badge */}
        <div className="mb-12 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-full px-8 py-4 shadow-xl">
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg tracking-wide">
            ✓ 100% ORIGINAIS
          </span>
          <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* CTA Button */}
        <Button 
          size="lg"
          onClick={scrollToProducts}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-accent hover:to-primary font-inter font-medium tracking-wide px-8 py-4 text-base transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-primary/20 border-0 backdrop-blur-xl"
        >
          Explorar Coleção
        </Button>
      </div>
      
      {/* Hero Image */}
      <div className="relative z-10 mt-16 w-full max-w-md mx-auto">
        <div className="relative">
          <img 
            src={heroImageUrl} 
            alt="KAJIM Luxury Watch" 
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;