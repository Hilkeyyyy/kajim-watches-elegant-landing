import { Button } from "@/components/ui/Button";
import { useSiteSettingsContext } from "@/contexts/SiteSettingsContext";
import { LoadingSpinner } from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  const { settings, isLoading } = useSiteSettingsContext();
  const navigate = useNavigate();
  
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const exploreCollection = () => {
    navigate('/buscar');
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

  const heroImageUrl = settings.hero_watch_image_url || settings.hero_image_url || heroWatch;
  const backgroundImageUrl = settings.hero_background_image_url;
  const enableBlur = settings.enable_hero_background_blur !== false;

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden px-4 py-12">
      {/* Background Image with Blur */}
      {backgroundImageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          {enableBlur && (
            <div className="absolute inset-0 backdrop-blur-md bg-background/70"></div>
          )}
        </>
      )}
      
      {/* Fallback gradient pattern */}
      {!backgroundImageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>
      )}
      
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
        
        {/* Modern Guarantee Badge with Liquid Glass Effect */}
        <div className="mb-12 inline-flex items-center gap-3 bg-gradient-to-r from-background/50 to-card/30 backdrop-blur-2xl border border-border/30 rounded-full px-8 py-4 shadow-2xl ring-1 ring-primary/10">
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse shadow-lg"></div>
          <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-lg tracking-wide">
            ✓ 100% ORIGINAIS
          </span>
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse shadow-lg"></div>
        </div>
        
        {/* CTA Button */}
        <Button 
          size="lg"
          onClick={exploreCollection}
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